"""
High-throughput in-RAM circular ring buffer for robotics telemetry.
Maintains a rolling temporal window of sensor streams without disk I/O.
"""

from collections import deque
import threading
import time
from typing import Any, Dict, List, Optional, Tuple


class BufferedMessage:
    __slots__ = ("topic", "timestamp_ns", "data", "schema_name", "size_bytes")

    def __init__(self, topic: str, timestamp_ns: int, data: Any, schema_name: str, size_bytes: int):
        self.topic = topic
        self.timestamp_ns = timestamp_ns
        self.data = data
        self.schema_name = schema_name
        self.size_bytes = size_bytes


class CircularRingBuffer:
    def __init__(self, duration_seconds: float = 20.0, max_ram_bytes: int = 512 * 1024 * 1024):
        self.duration_ns = int(duration_seconds * 1e9)
        self.max_ram_bytes = max_ram_bytes
        self.current_ram_bytes = 0

        self._buffer: deque[BufferedMessage] = deque()
        self._lock = threading.Lock()

    def push(self, topic: str, data: Any, schema_name: str = "json", timestamp_ns: Optional[int] = None, approx_size: int = 128) -> None:
        """Push a message into the ring buffer and evict expired/overflow data."""
        if timestamp_ns is None:
            timestamp_ns = time.time_ns()

        msg = BufferedMessage(
            topic=topic,
            timestamp_ns=timestamp_ns,
            data=data,
            schema_name=schema_name,
            size_bytes=approx_size,
        )

        with self._lock:
            self._buffer.append(msg)
            self.current_ram_bytes += approx_size

            # Evict messages older than duration_seconds
            cutoff_ns = timestamp_ns - self.duration_ns
            while self._buffer and self._buffer[0].timestamp_ns < cutoff_ns:
                evicted = self._buffer.popleft()
                self.current_ram_bytes -= evicted.size_bytes

            # Evict if exceeding max RAM ceiling
            while self._buffer and self.current_ram_bytes > self.max_ram_bytes:
                evicted = self._buffer.popleft()
                self.current_ram_bytes -= evicted.size_bytes

    def get_window(self, start_ns: int, end_ns: int) -> List[BufferedMessage]:
        """Extract a frozen temporal window of messages."""
        with self._lock:
            return [
                msg for msg in self._buffer
                if start_ns <= msg.timestamp_ns <= end_ns
            ]

    def get_all(self) -> List[BufferedMessage]:
        """Get copy of all currently buffered messages."""
        with self._lock:
            return list(self._buffer)

    def clear(self) -> None:
        with self._lock:
            self._buffer.clear()
            self.current_ram_bytes = 0

    def stats(self) -> Dict[str, Any]:
        with self._lock:
            count = len(self._buffer)
            oldest = self._buffer[0].timestamp_ns if count > 0 else 0
            newest = self._buffer[-1].timestamp_ns if count > 0 else 0
            return {
                "message_count": count,
                "ram_usage_bytes": self.current_ram_bytes,
                "ram_usage_mb": round(self.current_ram_bytes / (1024 * 1024), 2),
                "span_seconds": round((newest - oldest) / 1e9, 3) if count > 0 else 0.0,
            }
