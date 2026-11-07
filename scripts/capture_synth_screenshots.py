#!/usr/bin/env python3
"""
Diffraction Synthetic Data Factory Screenshot Automation via Playwright.
Captures high-resolution views of the NVIDIA Isaac Sim & OpenUSD Synthetic Data Platform.
"""

import os
import shutil
import time
from playwright.sync_api import sync_playwright

SCREENSHOTS_DIR = "storage/screenshots"
ARTIFACTS_DIR = "/Users/hrushi/.gemini/antigravity/brain/8fda2cf5-92a2-43af-8031-10b7495212e4"

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

def capture_all():
    print("[Playwright] Launching Chromium browser...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 1. Desktop Viewport (1440x900)
        desktop_context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=2
        )
        page = desktop_context.new_page()
        
        # 1. Landing Page
        print("[Playwright] 1. Capturing Landing Page...")
        page.goto("http://localhost:8080#overview", wait_until="networkidle")
        time.sleep(1)
        landing_path = os.path.join(SCREENSHOTS_DIR, "synth_landing_desktop.png")
        page.screenshot(path=landing_path, full_page=False)
        print(f"Captured: {landing_path}")

        # 2. Synthetic Factory Studio
        print("[Playwright] 2. Capturing Synthetic Factory Studio...")
        page.goto("http://localhost:8080#studio", wait_until="networkidle")
        time.sleep(1.2)
        studio_path = os.path.join(SCREENSHOTS_DIR, "synth_studio_desktop.png")
        page.screenshot(path=studio_path, full_page=False)
        print(f"Captured: {studio_path}")

        # 3. Dataset Catalog Hub
        print("[Playwright] 3. Capturing Dataset Catalog Hub...")
        page.goto("http://localhost:8080#catalog", wait_until="networkidle")
        time.sleep(1)
        catalog_path = os.path.join(SCREENSHOTS_DIR, "synth_catalog_desktop.png")
        page.screenshot(path=catalog_path, full_page=False)
        print(f"Captured: {catalog_path}")

        # 4. Sim-to-Real Alignment Lab
        print("[Playwright] 4. Capturing Sim-to-Real Alignment Lab...")
        page.goto("http://localhost:8080#sim2real", wait_until="networkidle")
        time.sleep(1)
        sim2real_path = os.path.join(SCREENSHOTS_DIR, "synth_sim2real_desktop.png")
        page.screenshot(path=sim2real_path, full_page=False)
        print(f"Captured: {sim2real_path}")

        # 5. Python SDK & API
        print("[Playwright] 5. Capturing Python SDK...")
        page.goto("http://localhost:8080#sdk", wait_until="networkidle")
        time.sleep(1)
        sdk_path = os.path.join(SCREENSHOTS_DIR, "synth_sdk_desktop.png")
        page.screenshot(path=sdk_path, full_page=False)
        print(f"Captured: {sdk_path}")

        # 6. Mobile Viewport (390x844 - iPhone 14)
        print("[Playwright] 6. Capturing Mobile Viewport...")
        mobile_context = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True
        )
        mobile_page = mobile_context.new_page()
        mobile_page.goto("http://localhost:8080#overview", wait_until="networkidle")
        time.sleep(1)
        mobile_path = os.path.join(SCREENSHOTS_DIR, "synth_mobile.png")
        mobile_page.screenshot(path=mobile_path, full_page=False)
        print(f"Captured: {mobile_path}")

        browser.close()

    # Mirror to artifacts directory
    for fname in os.listdir(SCREENSHOTS_DIR):
        if fname.startswith("synth_"):
            src = os.path.join(SCREENSHOTS_DIR, fname)
            dst = os.path.join(ARTIFACTS_DIR, fname)
            shutil.copy2(src, dst)
            print(f"Mirrored to Artifacts: {dst}")

    print("[Playwright] All synthetic factory screenshots captured successfully!")

if __name__ == "__main__":
    capture_all()
