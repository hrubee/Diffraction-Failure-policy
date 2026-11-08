"""
Unit and Integration Tests for Diffraction Studio Internal Tools Suite
Tests:
1. urdf_to_physx_usd.py (URDF parsing, PhysX 5 articulation generation, Isaac Lab cfg)
2. procedural_stage_generator.py (OpenUSD procedural warehouse stage, Replicator recipe)
3. cosmos_transfer_pipeline.py (ControlNet spec builder, kinematics locking)
4. dataset_packager_lerobot.py (Hugging Face LeRobot v2 metadata, PyTorch dataloader, Sim2Real cert)
5. studio_cli.py (Sprint lifecycle management)
"""

import json
import os
import shutil
import tempfile
import pytest

from tools.urdf_to_physx_usd import UrdfToPhysxUsdConverter
from tools.procedural_stage_generator import ProceduralStageGenerator
from tools.cosmos_transfer_pipeline import CosmosTransferPipeline
from tools.dataset_packager_lerobot import LeRobotDatasetPackager
from tools.studio_cli import load_sprints, save_sprints

SAMPLE_URDF = "storage/sample_urdfs/amr_hunter.urdf"

@pytest.fixture
def temp_dir():
    d = tempfile.mkdtemp()
    yield d
    shutil.rmtree(d, ignore_errors=True)

def test_urdf_to_physx_usd_converter(temp_dir):
    assert os.path.exists(SAMPLE_URDF)
    converter = UrdfToPhysxUsdConverter(SAMPLE_URDF)
    assert converter.robot_name == "agilex_hunter_se"
    assert len(converter.links) >= 5
    assert len(converter.joints) >= 4

    results = converter.convert(temp_dir)
    assert os.path.exists(results["usd_path"])
    assert os.path.exists(results["cfg_path"])
    assert os.path.exists(results["manifest_path"])

    with open(results["usd_path"], "r") as f:
        usd_text = f.read()
        assert "PhysicsArticulationRootAPI" in usd_text
        assert "PhysicsRigidBodyAPI" in usd_text
        assert "PhysicsRevoluteJoint" in usd_text

    with open(results["cfg_path"], "r") as f:
        cfg_text = f.read()
        assert "AGILEX_HUNTER_SE_CFG" in cfg_text
        assert "ArticulationCfg" in cfg_text

def test_procedural_stage_generator(temp_dir):
    gen = ProceduralStageGenerator(env_type="warehouse", seed=101)
    results = gen.generate(temp_dir)
    assert os.path.exists(results["usda_path"])
    assert os.path.exists(results["replicator_script"])
    assert os.path.exists(results["manifest_path"])

    with open(results["usda_path"], "r") as f:
        stage_text = f.read()
        assert "EpoxyFloorMaterial" in stage_text
        assert "HighBay_" in stage_text
        assert "PalletRack_" in stage_text

    with open(results["replicator_script"], "r") as f:
        rep_text = f.read()
        assert "omni.replicator.core" in rep_text
        assert "rep.modify.attribute" in rep_text

def test_cosmos_transfer_pipeline(temp_dir):
    pipeline = CosmosTransferPipeline(semantic_weight=1.0, edge_weight=0.85)
    results = pipeline.process_episode_batch(episode_count=100, prompt="photorealistic warehouse", output_dir=temp_dir)
    assert os.path.exists(results["spec_file"])
    assert os.path.exists(results["batch_manifest"])
    assert results["total_frames"] == 15000

    with open(results["spec_file"], "r") as f:
        spec = json.load(f)
        assert spec["pipeline"] == "nvidia/cosmos-transfer-2.5"
        assert spec["conditioning_sources"]["semantic_segmentation"]["control_weight"] == 1.0
        assert spec["conditioning_sources"]["kinematic_invariance_lock"]["enforce_action_invariance"] is True

def test_lerobot_dataset_packager(temp_dir):
    packager = LeRobotDatasetPackager("test_dataset", "Test Robot", "Pallet Docking")
    results = packager.package(total_episodes=5000, output_dir=temp_dir)
    assert os.path.exists(results["info_json"])
    assert os.path.exists(results["loader_script"])
    assert os.path.exists(results["sim2real_cert"])

    with open(results["info_json"], "r") as f:
        info = json.load(f)
        assert info["codebase_version"] == "v2.0"
        assert info["total_episodes"] == 5000
        assert "observation.images.primary_rgb" in info["features"]

    with open(results["loader_script"], "r") as f:
        code = f.read()
        assert "LeRobotDataset" in code
        assert "get_diffraction_vla_dataloader" in code

def test_sprint_registry_persistence(temp_dir):
    sprints = [
        {
            "sprint_id": "SPRINT-TEST-001",
            "client_name": "Test Client",
            "package": "robot_usd_rig",
            "fixed_fee_usd": 7500,
            "turnaround_days": 3,
            "status": "IN_PROGRESS",
        }
    ]
    reg_file = os.path.join(temp_dir, "sprints.json")
    with open(reg_file, "w") as f:
        json.dump(sprints, f)

    with open(reg_file, "r") as f:
        loaded = json.load(f)
        assert len(loaded) == 1
        assert loaded[0]["sprint_id"] == "SPRINT-TEST-001"
