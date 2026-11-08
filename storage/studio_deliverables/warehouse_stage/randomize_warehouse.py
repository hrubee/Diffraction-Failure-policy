# Diffraction Studio Internal Replicator Automation Recipe
# Environment: warehouse | Seed: 42
import omni.replicator.core as rep

def build_replicator_pipeline():
    with rep.new_layer():
        # 1. Randomize overhead luminaire intensities & color temperature
        lights = rep.get.prims(path_pattern="/World/Lighting/HighBay_.*")
        with lights:
            rep.modify.attribute("intensity", rep.distribution.uniform(150.0, 2500.0))
            rep.modify.attribute("colorTemperature", rep.distribution.choice([3200.0, 4500.0, 6000.0]))

        # 2. Randomize floor friction parameters
        floor_mat = rep.get.prims(path_pattern="/World/Materials/EpoxyFloorMaterial")
        with floor_mat:
            rep.physics.physics_material(
                dynamic_friction=rep.distribution.uniform(0.12, 0.88),
                static_friction=rep.distribution.uniform(0.18, 0.95),
                restitution=0.05
            )

        # 3. Randomize pallet clutter poses
        racks = rep.get.prims(path_pattern="/World/Racks/PalletRack_.*")
        with racks:
            rep.modify.pose(
                position=rep.distribution.uniform((-18.0, -12.0, 0.0), (18.0, 12.0, 0.0)),
                rotation=rep.distribution.uniform((0, 0, -45), (0, 0, 45))
            )

    # 4. Attach synchronized multi-modal render products
    cam = rep.create.camera(position=(0, -8, 2.5), look_at=(0, 0, 0.5))
    rp_rgb = rep.create.render_product(cam, (1920, 1080))
    writer = rep.WriterRegistry.get("BasicWriter")
    writer.initialize(
        output_dir="storage/sim_output",
        rgb=True,
        distance_to_image_plane=True,
        semantic_segmentation=True
    )
    writer.attach([rp_rgb])

rep.orchestrator.run()
