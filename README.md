# 📡 Wireless & Mobile Networks Online Calculator

## 📌 Overview
This project provides **five online calculators** designed to compute various wireless network parameters. The calculators allow users to input system parameters and obtain important values related to:
1. **Bit rate calculations** for sampler, quantizer, source encoder, channel encoder, and interleaver.
2. **OFDM resource element calculations** for bits per symbol, resource block, and transmission rate.
3. **Power transmission estimation** based on transmitter and receiver specifications.
4. **Throughput computation** for different **Carrier Sense Multiple Access (CSMA) protocols**.
5. **Cellular system design** for estimating cell size, number of cells, and total traffic.

📌 **Developed Using:**  
✔ **HTML, CSS, and JavaScript** for interactive calculations.  
✔ **Form validation** to ensure correct input values.  

## 🚀 Features & Functionality

### 🔢 **Calculator 1: Bit Rate Computation**
**Inputs:**  
✔ Bandwidth  
✔ Number of bits for quantization  
✔ Compression rate  
✔ Channel encoder rate  
✔ Number of bits per interleaver  

**Outputs:**  
✔ Sampling frequency  
✔ Number of quantization levels  
✔ Bit rate at different encoding stages (source, channel, interleaver)  

### 📡 **Calculator 2: OFDM Resource Elements Calculation**
**Inputs:**  
✔ Bandwidth of resource block  
✔ Subcarrier spacing  
✔ Number of OFDM symbols per block  
✔ Modulation type  
✔ Number of parallel resource blocks  

**Outputs:**  
✔ Number of bits per resource element  
✔ Bits per OFDM symbol 
✔ Maximum transmission rate                                            
✔ Number of bits per resource block 


### 🔋 **Calculator 3: Power Transmission Estimation**
**Includes a dB conversion calculator!**  
**Inputs:**  
✔ Path loss, frequency, antenna gain, amplifier gain  
✔ Data rate, noise temperature, fade margin  
✔ Other system losses and link margin  

**Outputs:**  
✔  Total transmit power

### 📡 **Calculator 4: CSMA Throughput Analysis**
**Supports:**  
✔ Unslotted & Slotted Non-Persistent CSMA  
✔ Unslotted & Slotted 1-Persistent CSMA  

**Inputs:**  
✔ System parameters like transmission probability and idle time  
✔ User input validation (ensures positive values)  

**Outputs:**  
✔ Throughput percentage of CSMA type  

### 📶 **Calculator 5: Cellular System Design**
**Inputs:**  
✔ Maximum cell size & distance  
✔ Traffic per user & total traffic  
✔ Number of carriers per system  

**Outputs:**  
✔ Number of cells
✔ Traffic per cell  
✔ Cluster & carrier allocation
✔ Maximum Distance
✔ Maximum Cell Size
✔ Number of Channels



---

## 📊 Sample Scenarios
Each calculator was tested with at least **three different scenarios**, verifying the correctness of outputs.  
✔ **Valid Inputs:** Different network conditions were tested.  
✔ **Error Handling:** Cases where inputs violated constraints were handled with messages.  

---

## 🛠 Technologies Used
- **Frontend:** HTML, CSS, JavaScript  
- **Validation & Error Handling:** JavaScript  
- **Design & Styling:** CSS  

---

## 📎 How to Run the Code?
### 1️⃣ Open the Calculator  
Simply **open the `index.html` file** in a web browser.

### 2️⃣ Use the Input Fields  
- Enter system parameters.
- Click **"Calculate"** to get results.

### 3️⃣ View the Results  
- Outputs are displayed instantly.
- Errors are shown if inputs are invalid.

---

## 📢 Conclusion
This project provides an interactive **wireless network calculator** covering:
✔ **Bit rate & OFDM transmission rate**  
✔ **Power calculations for flat environments**  
✔ **CSMA throughput estimation**  
✔ **Cellular system design modeling**  

The online calculators ensure **accurate computations** while providing an easy-to-use interface.

---
---
## 👨‍💻 Authors
This project was developed by:

- **Yazeed Hamdan**
- **Saja Shareef**

---
## 📫 Contact
For any questions or discussions, feel free to reach out:

[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:yazedyazedl2020@gmail.com)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/yazeed-hamdan-59b83b281/)  


