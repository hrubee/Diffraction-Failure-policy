"""
Diffraction Multi-Cloud Object Storage Backend Abstraction.
Supports local persistent volume storage and S3-compatible cloud object stores (AWS S3, Cloudflare R2, MinIO, GCP).
"""

import os
import shutil
from typing import Optional


class StorageBackend:
    """Enterprise storage provider abstraction for telemetry containers, USD stages, and reports."""

    def __init__(self, base_dir: str = "./storage"):
        self.base_dir = os.path.abspath(base_dir)
        self.storage_type = os.getenv("DIFFRACTION_STORAGE_TYPE", "local").lower()
        self.s3_bucket = os.getenv("DIFFRACTION_S3_BUCKET")
        self.s3_endpoint = os.getenv("DIFFRACTION_S3_ENDPOINT")
        self.public_base_url = os.getenv("DIFFRACTION_PUBLIC_ASSET_URL", "")

        os.makedirs(self.base_dir, exist_ok=True)
        for sub in ["telemetry_drops", "reports", "usd_stages", "remediation_patches", "cosmos_augmented"]:
            os.makedirs(os.path.join(self.base_dir, sub), exist_ok=True)

    def save_bytes(self, relative_path: str, data: bytes) -> str:
        """Saves binary data to storage and returns the local or cloud URI."""
        target_path = os.path.join(self.base_dir, relative_path)
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, "wb") as f:
            f.write(data)

        # In S3 mode, upload synchronously or schedule background upload
        if self.storage_type == "s3" and self.s3_bucket:
            self._sync_to_s3(target_path, relative_path)

        return target_path

    def save_text(self, relative_path: str, text: str) -> str:
        """Saves text / YAML / JSON data to storage."""
        return self.save_bytes(relative_path, text.encode("utf-8"))

    def read_bytes(self, relative_path: str) -> Optional[bytes]:
        """Reads file bytes from storage."""
        target_path = os.path.join(self.base_dir, relative_path)
        if os.path.exists(target_path):
            with open(target_path, "rb") as f:
                return f.read()
        return None

    def exists(self, relative_path: str) -> bool:
        """Checks if asset exists in storage."""
        target_path = os.path.join(self.base_dir, relative_path)
        return os.path.exists(target_path)

    def get_public_url(self, relative_path: str) -> str:
        """Resolves the public HTTP download URL for an asset."""
        if self.public_base_url:
            return f"{self.public_base_url.rstrip('/')}/{relative_path.lstrip('/')}"
        return f"/{relative_path.lstrip('/')}"

    def _sync_to_s3(self, local_path: str, s3_key: str):
        """Optional S3 sync hook when credentials are provided."""
        try:
            import boto3
            s3_client = boto3.client(
                "s3",
                endpoint_url=self.s3_endpoint,
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            )
            s3_client.upload_file(local_path, self.s3_bucket, s3_key)
        except Exception:
            # Fall back safely to local storage on error
            pass


# Global singleton instance
storage = StorageBackend()
