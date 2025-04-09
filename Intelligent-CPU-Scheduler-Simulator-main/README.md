# Intelligent CPU Scheduling  Simulator

## Description
This project is an interactive web-based CPU scheduling algorithm simulator featuring multiple scheduling algorithms with visualization. It is created for educational purposes to help understand how different CPU scheduling algorithms work.

### Purpose
The purpose of this project is to provide a visual and interactive way to learn and understand various CPU scheduling algorithms. It allows users to input different processes and visualize how each scheduling algorithm handles them.

### Features
- Supports multiple CPU scheduling algorithms: FCFS, SJF, SRTF, Round Robin, and Priority scheduling(Pre-emptive & Non-Pre-emptive).
- Real-Time Gantt chart visualization.
- Detailed results including completion time, turnaround time, waiting time, and response time for each process.
- Dark mode support.

## Installation
To install and run the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Tarun1322/CPU-Scheduling-Algorithms.git
   ```
2. Navigate to the project directory:
   ```bash
   cd CPU-scheduler
   ```
3. Open `index.html` in your web browser to start the simulator.

## Usage
1. Select a CPU scheduling algorithm from the dropdown menu.
2. Enter the arrival times, burst times, and priority values (if applicable) for the processes.
3. Click the "Process Input" button to add the processes.
4. Click the "Calculate" button to visualize the scheduling algorithm and see the results.
5. Click the "Start" button see the real-time visulaisation of the Gantt Chart. 

### Examples
Here are some examples of how to use the simulator:

#### Example 1: First Come First Served (FCFS)
- Arrival Times: `0 1 2 3`
- Burst Times: `3 6 4 5`

#### Example 2: Shortest Job First (SJF)
- Arrival Times: `0 1 2 3`
- Burst Times: `6 8 7 3`

#### Example 3: Shortest Remaining Time First (SRTF)
- Arrival Times: `0 2 4 6`
- Burst Times: `8 4 9 5`

#### Example 4: Round Robin
- Arrival Times: `0 1 2 3`
- Burst Times: `5 4 3 2`
- Time Quantum: `2`

#### Example 5: Priority Scheduling (Non-preemptive)
- Arrival Times: `0 1 2 3`
- Burst Times: `4 3 2 1`
- Priority Values: `2 1 3 4`

#### Example 6: Priority Scheduling (Preemptive)
- Arrival Times: `0 1 2 3`
- Burst Times: `4 3 2 1`
- Priority Values: `2 1 3 4`

## Contributing
Contributions are welcome! If you have any suggestions or improvements, please create a pull request or open an issue on GitHub.

### Guidelines
- Fork the repository.
- Create a new branch for your feature or bugfix.
- Make your changes and commit them with clear and concise messages.
- Push your changes to your forked repository.
- Create a pull request to the main repository.

## Resources
- [GitHub Repository](https://github.com/Tarun1322/CPU-Scheduling-Algorithms.git)
- [Tarun's GitHub Profile](https://github.com/Tarun1322)
