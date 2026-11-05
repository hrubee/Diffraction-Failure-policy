import time
from edge.ring_buffer import CircularRingBuffer


def test_circular_ring_buffer_eviction():
    # 1-second buffer duration
    buffer = CircularRingBuffer(duration_seconds=0.5, max_ram_bytes=10000)

    now_ns = time.time_ns()
    # Push old message
    buffer.push(topic="/test", data={"step": 1}, timestamp_ns=now_ns - int(1.0 * 1e9))
    # Push recent message
    buffer.push(topic="/test", data={"step": 2}, timestamp_ns=now_ns)

    msgs = buffer.get_all()
    # The 1-second-old message should be evicted because duration is 0.5s
    assert len(msgs) == 1
    assert msgs[0].data["step"] == 2


def test_circular_ring_buffer_window_extraction():
    buffer = CircularRingBuffer(duration_seconds=5.0)
    base_ns = time.time_ns()

    for i in range(10):
        buffer.push(topic="/odom", data={"i": i}, timestamp_ns=base_ns + i * 1000)

    # Extract window from step 3 to 7
    window = buffer.get_window(start_ns=base_ns + 3000, end_ns=base_ns + 7000)
    assert len(window) == 5
    assert window[0].data["i"] == 3
    assert window[-1].data["i"] == 7
