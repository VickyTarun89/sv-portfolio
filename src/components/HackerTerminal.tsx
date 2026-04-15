import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const LOG_MESSAGES = [
  "SYSTEM_INITIALIZING...",
  "ESTABLISHING_SECURE_CONNECTION",
  "DECRYPTING_PACKETS_0x7F42A",
  "BYPASSING_FIREWALL_LOAD_BALANCER",
  "ACCESS_GRANTED_UID_0",
  "INJECTING_PAYLOAD_V3.2",
  "EXTRACTING_ENCRYPTED_KEYS",
  "CLEANING_LOGS_SILENT_MODE",
  "TRACING_IP_192.168.1.104",
  "REMOTE_SHELL_ESTABLISHED",
  "UPLOADING_RESUME_TO_MAIN_FRAME",
  "OPTIMIZING_NEURAL_NETWORKS",
  "SCANNING_VULNERABILITIES",
  "PATCHING_KERNEL_PANIC",
  "SYNCHRONIZING_CORE_VALS",
  "EXECUTING_PORTFOLIO_DYNAMICS",
  "LISTENING_PORT_443",
  "SOCKET_ESTABLISHED_READY",
];

const HackerTerminal = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
        const newLogs = [...prev, `[${new Date().toLocaleTimeString()}] ${nextLog}`];
        if (newLogs.length > 100) return newLogs.slice(1);
        return newLogs;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 select-none">
      <div 
        ref={terminalRef}
        className="h-full w-full p-4 font-mono text-[10px] sm:text-xs leading-tight whitespace-pre-wrap overflow-hidden"
        style={{ color: "#00FF41", textShadow: "0 0 5px rgba(0, 255, 65, 0.5)" }}
      >
        {logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1 }}
          >
            {log}
          </motion.div>
        ))}
        <div className="inline-block w-2 h-4 bg-[#00FF41] animate-pulse ml-1 align-middle" />
      </div>
    </div>
  );
};

export default HackerTerminal;
