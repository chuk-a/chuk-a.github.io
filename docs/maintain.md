<img src="/img/CO2%20and%20Plantower%20for%20esphome%20v1_bb.png" alt="CO2 and Plantower for esphome v1_bb" width="300" />

# ESP32 Code

Keeping things running smoothly is just as important as building them. On the Maintain page, you'll find best practices, troubleshooting tips, and everything you need to ensure your projects stay in top shape. Let's keep your creations thriving!

```yaml
esphome:
  name: airqualitymonitor
  friendly_name: Senseair CO2 and PMSX003

esp32:
  board: esp32dev
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "...."

ota:
  platform: esphome
  password: "..."

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "Senseair Fallback Hotspot"
    password: "...."

captive_portal:
# UART (Universal Asynchronous Receiver-Transmitter) configurations for serial communication with sensors
uart:
  # UART1 Configuration for PMSA003 particulate matter sensor
  - id: uart_id1 # Unique identifier for this UART instance
    tx_pin: GPIO17 # Transmit pin for UART1
    rx_pin: GPIO16 # Receive pin for UART1
    baud_rate: 9600 # Communication speed for PMSA003

  # UART2 Configuration for SenseAir S8 CO2 sensor
  - id: uart_id2 # Unique identifier for this UART instance
    tx_pin: GPIO18 # Transmit pin for UART2
    rx_pin: GPIO19 # Receive pin for UART2
    baud_rate: 9600 # Communication speed for SenseAir S8

# Sensor configurations
sensor:
  - platform: pmsx003
    type: PMSx003
    uart_id: uart_id1
    pm_1_0:
      name: "Particulate Matter <1.0µm Concentration"
    pm_2_5:
      name: "Particulate Matter <2.5µm Concentration"
    pm_10_0:
      name: "Particulate Matter <10.0µm Concentration"
    update_interval: 90s

# SenseAir S8 Sensor Configuration
  - platform: senseair
    id: my_senseair_id
    uart_id: uart_id2
    update_interval: 60s
    co2:
      name: "SenseAir CO2"
      id: senseair_co2
      filters:
        - lambda: |-
            if (x <= 0 || x > 5000) {
              ESP_LOGW("senseair", "Invalid CO2 reading detected: %.0f. Keeping previous value.", x); // Use // for comments in C++ lambda
              return id(senseair_co2).state; // Return the last known good state
            }
            return x; // Return the valid reading

# Switch configurations for controlling sensor features or device status
switch:
  # Template switch to track the ABC (Automatic Baseline Correction) status of the SenseAir S8
  - platform: template
    name: "ABC Status"
    id: abc_status
    restore_mode: RESTORE_DEFAULT_OFF # Restores to OFF on reboot if no previous state is known
    internal: true # Makes this switch internal to ESPHome, not exposed to Home Assistant directly
    optimistic: true # Assumes the action succeeds immediately without waiting for confirmation

  # Template switch to trigger a background calibration for the CO2 sensor
  - platform: template
    name: "Calibrate CO2 Sensor"
    id: calibrate_co2_sensor
    optimistic: true
    turn_on_action:
      - senseair.background_calibration: my_senseair_id # Calls the SenseAir background calibration service
      - delay: 1s # Short delay to allow the sensor to process the command
      - logger.log:
          format: "Calibration triggered. Last CO2 reading: %.1f ppm"
          args: ['id(senseair_co2).state'] # Logs the current CO2 reading for context

  # Template switch to get and log the current ABC status from the SenseAir S8
  - platform: template
    name: "Get ABC Status"
    turn_on_action:
      - senseair.abc_get_period: my_senseair_id # Requests the ABC period from the sensor
      - delay: 1s # Short delay for sensor response
      - logger.log:
          format: "ABC Status: %s" # Logs whether ABC is ON or OFF based on the internal tracker
          args:
            - !lambda 'id(abc_status).state ? "ON" : "OFF"'

  # Template switch to enable ABC (Automatic Baseline Correction) on the CO2 sensor
  - platform: template
    name: "ABC Enable"
    id: abc_enable
    optimistic: true
    turn_on_action:
      - senseair.abc_enable: my_senseair_id # Sends command to enable ABC
      - delay: 1s # Short delay
      - switch.turn_on: abc_status # Updates the internal ABC status tracker
    # Optional: Add a turn_off_action to ensure consistency if this switch is toggled off
    turn_off_action:
      - switch.turn_off: abc_status

  # Template switch to disable ABC (Automatic Baseline Correction) on the CO2 sensor
  - platform: template
    name: "ABC Disable"
    id: abc_disable
    optimistic: true
    turn_on_action:
      - senseair.abc_disable: my_senseair_id # Sends command to disable ABC
      - delay: 1s # Short delay
      - switch.turn_off: abc_status # Updates the internal ABC status tracker
    # Optional: Add a turn_off_action to ensure consistency if this switch is toggled off
    turn_off_action:
      - switch.turn_on: abc_status
```

