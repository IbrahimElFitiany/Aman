
# 🚨 Aman — Intruder Alarm System
![AmanLogo](https://i.postimg.cc/5NFYGmcq/icon-logo-cdfasdfopy.png)

**Aman** is a full-stack intruder alarm system that simulates a smart security infrastructure using modular web applications.
It is designed for homes and buildings, where sensor-triggered alarms are managed and responded to in real-time using modern technologies like
**MQTT** and **WebSockets**.

---

## 🧠 Overview

Aman consists of **three core modules**:

### 1. 👤 Customer Module
- Users register their homes and rooms.
- Add and configure motion and door sensors.
- Sensors are simulated IoT devices that publish alerts via **MQTT** when triggered.

### 2. 🛡️ Security Module
- Receives real-time alerts from MQTT topics.
- Displays alert location on a map.
- Allows security staff to dispatch a team or take remote action (e.g., locking doors).

### 3. 🧑‍💼 Admin Module
- Manages users, security teams, and stations.
- Monitors area-wise intrusion rates.
- Controls auto-assignment of employees to high-risk zones using an intelligent rotation algorithm.

---

## ⚙️ Architecture

```plaintext
[ Sensors (Simulated IoT) ]
        |
     MQTT Broker (Docker)
        |
  ┌────────────┬──────────────┐
  |            |              |
[Customer]  [Security]     [Admin]
(Frontend)   (Realtime)    (Management)
