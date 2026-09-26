/**
 * Every "measured" number here comes from docs/status.md and the result files under benchmarks/results/
 * (runs verify-20260912T051348Z, verify-20260912T073802Z, bench-20260912T082157Z, failure-20260912T*).
 * Numbers in `projection` are not measurements: they extrapolate the measured single-host figures along the
 * architecture's scale-out path, and the page labels them as projected wherever they appear.
 */

export const GITHUB_URL = "https://github.com/sanjaykannan8/OT-Security";
export const DOCS_URL = `${GITHUB_URL}/blob/main/docs/status.md`;
export const TEAM = "FirstByte07";

/** First alert per attack episode: receiver arrival of the deciding evidence -> alert written (e2e run). */
export const alertLatency = [
  { attack: "Encrypted C2", ms: 521 },
  { attack: "SYN flood", ms: 544 },
  { attack: "DGA malware", ms: 571 },
  { attack: "DNS tunnel", ms: 575 },
  { attack: "Beaconing", ms: 586 },
  { attack: "Exfiltration", ms: 599 },
  { attack: "Port scan", ms: 625 },
  { attack: "Amplification", ms: 823 },
];

/** Sustained open-loop load: detection latency percentiles over new/escalated updates (bench run). */
export const loadLatency = [
  { rate: "100 eps", p50: 678, p95: 1175, p99: 1532 },
  { rate: "500 eps", p50: 868, p95: 1374, p99: 1615 },
  { rate: "1000 eps", p50: 828, p95: 1468, p99: 1801 },
];

/** Evidence each detector needs before it speaks: attack onset -> alert, in observation time (seconds). */
export const evidenceWindow = [
  { attack: "SYN flood", s: 0.14 },
  { attack: "Port scan", s: 3.0 },
  { attack: "Amplification", s: 3.0 },
  { attack: "DGA malware", s: 4.5 },
  { attack: "DNS tunnel", s: 15.0 },
  { attack: "Exfiltration", s: 40.1 },
  { attack: "Encrypted C2", s: 42.3 },
];

export const faultChecks = [
  { name: "TaskManager killed", fault: "kill the stream worker mid-flight", detail: "Flink kept the same job, 43 checkpoints intact" },
  { name: "JobManager restarted", fault: "restart the job coordinator", detail: "Supervisor restored the job from a retained checkpoint" },
  { name: "Full stack down and up", fault: "take every service down, then up", detail: "Restored from checkpoint; 16,643 of 16,643 events kept" },
  { name: "Message broker restarted", fault: "restart Redpanda during a live replay", detail: "Receiver spool absorbed it; the DNS tunnel was still caught" },
  { name: "Database outage", fault: "stop ClickHouse under load", detail: "Detection and alerting carried on; storage caught up after" },
  { name: "Forged and malformed frames", fault: "inject bad-signature and broken frames", detail: "Quarantined by reason code; gaps counted, never hidden" },
  { name: "Archive outage", fault: "take the evidence archive offline", detail: "Nothing dropped while the archive was unreachable" },
];

export const detectors = [
  "Port & host scanning",
  "SYN floods",
  "Spoofed-source floods",
  "UDP amplification",
  "C2 beaconing",
  "DGA malware domains",
  "NXDOMAIN bursts",
  "DNS tunnelling",
  "Suspicious TLS metadata",
  "Data exfiltration",
];

/** Measured single-host figures that the projection starts from. */
export const measuredNode = {
  losslessEps: 100,
  acceptedEps: 390,
  backpressureMs: 0,
};

/**
 * Projected throughput with per-sensor sharding: each sensor gets its own receiver and link, and Flink
 * workers and topic partitions are added alongside. Linear from the measured single-host ceiling.
 */
export const projection = [1, 2, 4, 8, 16, 32, 64].map((shards) => ({
  shards: `${shards}`,
  eps: shards * measuredNode.acceptedEps,
}));


export const stack = [
  { name: "Zeek 8", role: "Passive sensing" },
  { name: "One-way link", role: "Signed UDP, no return path" },
  { name: "Redpanda", role: "Kafka-compatible event log" },
  { name: "Apache Flink", role: "Exactly-once streaming" },
  { name: "ONNX Runtime", role: "In-stream ML" },
  { name: "ClickHouse", role: "Columnar analytics" },
  { name: "MinIO", role: "Write-once evidence vault" },
  { name: "Grafana", role: "Platform health" },
];

/**
 * Attacks the simulator can replay. `alertMs` and `evidenceS` are the measured values from the e2e run; `finding`
 * describes the rule that fired, using the thresholds configured in flink/sih_detect/config.py.
 */
export const attacks = [
  { id: "scan", name: "Port scan", detector: "Scan detector", severity: "High", alertMs: 625, evidenceS: 3.0,
    finding: "one source reached 20+ hosts on one port inside 30 s" },
  { id: "dga", name: "DGA malware", detector: "DNS detector + ONNX model", severity: "High", alertMs: 571, evidenceS: 4.5,
    finding: "10+ random-looking domains failed to resolve; model scored them DGA-like" },
  { id: "syn", name: "SYN flood", detector: "DDoS detector", severity: "High", alertMs: 544, evidenceS: 0.14,
    finding: "SYN rate far above baseline, handshakes left half-open; refined to spoofed-source" },
  { id: "tunnel", name: "DNS tunnel", detector: "DNS detector", severity: "High", alertMs: 575, evidenceS: 15.0,
    finding: "long, high-entropy subdomains streaming under one parent domain" },
  { id: "exfil", name: "Data exfiltration", detector: "Exfiltration detector", severity: "High", alertMs: 599, evidenceS: 40.1,
    finding: "sustained upload volume far above this host's learned baseline" },
  { id: "tls", name: "Encrypted C2", detector: "TLS metadata detector", severity: "Medium", alertMs: 521, evidenceS: 42.3,
    finding: "weighted TLS handshake indicators crossed the threshold, with no decryption" },
] as const;

export type Attack = (typeof attacks)[number];
