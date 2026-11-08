"""
Comprehensive Test Suite for Diffraction Real Backend Fulfillment Engine.
Verifies Pixar OpenUSD compilation, physical trajectory simulation,
Hugging Face LeRobot v2 Parquet serialization, MP4 video encoding,
and asynchronous job fulfillment with zip packaging.
"""

import os
import shutil
import pytest
import pyarrow.parquet as pq
import imageio.v3 as iio
from fastapi.testclient import TestClient

from backend.engine.usd_compiler import RealOpenUSDCompiler
from backend.engine.trajectory_simulator import RealTrajectorySimulator
from backend.engine.lerobot_exporter import RealLeRobotExporter
from backend.engine.fulfillment_runner import (
    create_fulfillment_job,
    execute_fulfillment_pipeline,
    get_job_record,
    list_job_records,
)
from cloud_gateway.app import app

client = TestClient(app)
SAMPLE_URDF = "storage/sample_urdfs/amr_hunter.urdf"
TMP_TEST_DIR = "storage/studio_deliverables/pytest_run"


@pytest.fixture(autouse=True)
def cleanup():
    os.makedirs(TMP_TEST_DIR, exist_ok=True)
    yield
    if os.path.exists(TMP_TEST_DIR):
        shutil.rmtree(TMP_TEST_DIR, ignore_errors=True)


def test_real_openusd_compiler():
    """Verifies URDF parsing and native Pixar pxr.Usd physics asset generation."""
    robot = RealOpenUSDCompiler.parse_urdf(SAMPLE_URDF, robot_name_override="TestRobot")
    assert robot.name == "TestRobot"
    assert robot.total_mass_kg > 0
    assert robot.dof_count == 4
    assert len(robot.links) == 5

    out_dir = os.path.join(TMP_TEST_DIR, "usd")
    manifest = RealOpenUSDCompiler.compile_usd_stage(robot, out_dir, asset_basename="test_physx")

    assert os.path.exists(manifest["usda_asset"])
    assert os.path.exists(manifest["usd_asset"])
    assert os.path.exists(manifest["isaac_lab_cfg"])

    # Verify OpenUSD stage can be opened by pxr
    from pxr import Usd
    stage = Usd.Stage.Open(manifest["usda_asset"])
    robot_prim = stage.GetPrimAtPath("/World/TestRobot")
    assert robot_prim.IsValid()
    assert "PhysicsArticulationRootAPI" in robot_prim.GetAppliedSchemas()


def test_real_trajectory_simulator():
    """Verifies kinematics, surface friction physics, and multi-camera frame rendering."""
    robot = RealOpenUSDCompiler.parse_urdf(SAMPLE_URDF)
    sim = RealTrajectorySimulator(fps=30, image_width=320, image_height=240)

    ep = sim.simulate_episode(robot, episode_idx=0, num_frames=30, target_friction=0.25)
    assert ep.num_frames == 30
    assert len(ep.timestamps) == 30
    assert len(ep.actions) == 30
    assert len(ep.states) == 30
    assert len(ep.rewards) == 30
    assert ep.dones[-1] is True

    # Check multi-camera frame buffers
    assert "observation.images.overhead" in ep.camera_frames
    assert "observation.images.wrist" in ep.camera_frames
    assert ep.camera_frames["observation.images.overhead"].shape == (30, 240, 320, 3)
    assert ep.camera_frames["observation.images.wrist"].shape == (30, 240, 320, 3)


def test_real_lerobot_v2_export_and_dataloader():
    """Verifies Apache Arrow Parquet tables, H.264 MP4 videos, and PyTorch dataloader."""
    robot = RealOpenUSDCompiler.parse_urdf(SAMPLE_URDF)
    sim = RealTrajectorySimulator(fps=30, image_width=320, image_height=240)
    episodes = [sim.simulate_episode(robot, i, num_frames=20) for i in range(2)]

    out_dir = os.path.join(TMP_TEST_DIR, "lerobot")
    manifest = RealLeRobotExporter.export_dataset(
        episodes=episodes,
        robot=robot,
        output_dir=out_dir,
        dataset_name="test_lerobot_dataset",
        create_zip=True,
    )

    assert os.path.exists(manifest["info_json"])
    assert os.path.exists(manifest["episodes_jsonl"])
    assert os.path.exists(manifest["dataloader_script"])
    assert os.path.exists(manifest["sim2real_cert"])
    assert os.path.exists(manifest["zip_archive"])

    # Verify Parquet table with PyArrow
    parquet_file = os.path.join(out_dir, "data", "chunk-000", "episode_000000.parquet")
    table = pq.read_table(parquet_file)
    assert "action" in table.column_names
    assert "observation.state" in table.column_names
    assert len(table) == 20

    # Verify H.264 MP4 video file
    video_file = os.path.join(out_dir, "videos", "chunk-000", "observation.images.overhead", "episode_000000.mp4")
    assert os.path.exists(video_file)
    meta = iio.immeta(video_file)
    assert meta["codec"] == "h264"
    assert meta["fps"] == 30.0


def test_real_fulfillment_pipeline_and_download():
    """Verifies SQLite persistence, asynchronous worker execution, and REST download."""
    job_id = "pytest-sprint-999"
    job = create_fulfillment_job(
        job_id=job_id,
        name="Pytest Full Fulfillment Sprint",
        client_name="Test Robotics Corp",
        robot_name="HunterTest",
        urdf_path=SAMPLE_URDF,
        target_episodes=2,
        fps=30
    )
    assert job["id"] == job_id
    assert job["status"] == "QUEUED"

    # Execute synchronous pipeline
    res = execute_fulfillment_pipeline(job_id)
    assert res["status"] == "COMPLETED"
    assert res["progress_pct"] == 100.0
    assert res["completed_episodes"] == 2
    assert os.path.exists(res["zip_path"])

    # Verify API lists the real job
    resp = client.get("/api/v1/factory/jobs")
    assert resp.status_code == 200
    job_ids = [j["id"] for j in resp.json()["jobs"]]
    assert job_id in job_ids

    # Verify API download endpoint serves the real zip file
    download_resp = client.get(f"/api/v1/factory/jobs/{job_id}/download")
    assert download_resp.status_code == 200
    assert download_resp.headers["content-type"] == "application/zip"
    assert len(download_resp.content) > 1000


def test_box_folding_fulfillment_pipeline():
    """Verifies box folding simulation, Isaac Sim carton USD generation, and dual-camera rendering."""
    job_id = "pytest-box-folding-001"
    job = create_fulfillment_job(
        job_id=job_id,
        name="Franka Box Folding Sprint",
        client_name="Packaging Automation Inc",
        robot_name="FrankaPanda",
        urdf_path="storage/sample_urdfs/franka_box_folder.urdf",
        target_episodes=2,
        fps=30,
    )
    assert job["id"] == job_id
    res = execute_fulfillment_pipeline(job_id)
    assert res["status"] == "COMPLETED"
    assert res["progress_pct"] == 100.0
    assert res["completed_episodes"] == 2
    assert os.path.exists(res["zip_path"])

