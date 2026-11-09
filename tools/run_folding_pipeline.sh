#!/usr/bin/env bash
# =============================================================================
# Diffraction Studio: Turnkey Autonomous Box Folding Pipeline
# Executes end-to-end box-folding simulation, LeRobot dataset packaging,
# animated OpenUSD stage export, and multi-camera rollout video compilation.
#
# USAGE:
#   ./tools/run_folding_pipeline.sh --input <carton.usda> --output <output_dir>
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

INPUT_USD=""
OUTPUT_DIR="${REPO_ROOT}/storage/pipeline_output"
STEPS="300"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --input|-i)
            INPUT_USD="$2"
            shift 2
            ;;
        --output|-o)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --steps|-s)
            STEPS="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

if [[ -z "$INPUT_USD" ]]; then
    # Default to sample carton if available
    DEFAULT_CARTON="${REPO_ROOT}/storage/studio_deliverables/job-box-folding-isaacsim-4090/carton_box_flat.usda"
    if [[ -f "$DEFAULT_CARTON" ]]; then
        INPUT_USD="$DEFAULT_CARTON"
    else
        echo "ERROR: --input <path_to_carton.usda> is required." >&2
        exit 1
    fi
fi

echo "================================================================="
echo "  DIFFRACTION STUDIO // AUTONOMOUS BOX FOLDING PIPELINE LAUNCHER "
echo "================================================================="
echo "  • Input OpenUSD:  ${INPUT_USD}"
echo "  • Output Target:  ${OUTPUT_DIR}"
echo "  • Simulation Steps: ${STEPS}"
echo "================================================================="

# Detect runtime environment
if [[ -f "/isaac-sim/python.sh" ]]; then
    echo "[*] Detected NVIDIA Isaac Sim 4.0 runtime environment."
    /isaac-sim/python.sh "${SCRIPT_DIR}/box_folding_pipeline.py" --input "$INPUT_USD" --output "$OUTPUT_DIR" --steps "$STEPS"
elif command -v python3 >/dev/null 2>&1; then
    echo "[*] Running with standard Python runtime."
    python3 "${SCRIPT_DIR}/box_folding_pipeline.py" --input "$INPUT_USD" --output "$OUTPUT_DIR" --steps "$STEPS"
else
    echo "ERROR: Neither Isaac Sim python.sh nor python3 found in PATH." >&2
    exit 1
fi

echo "================================================================="
echo "  [SUCCESS] Autonomous pipeline execution finished cleanly.      "
echo "================================================================="
