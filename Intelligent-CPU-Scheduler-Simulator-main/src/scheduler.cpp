#include "scheduler.h"
#include <iostream>
#include <queue>
#include <algorithm>
#include <iomanip>

//------------------------------------------------------------
// Helper Function to Print Gantt Chart
void SchedulingAlgorithm::printGanttChart() {
    std::cout << "\nGantt Chart:\n";
    std::cout << "--------------------------------------------------\n";
    int time = 0;
    for (const auto& segment : gantt_chart) {
        std::cout << "| P" << segment.first << " ";
        time += segment.second;
    }
    std::cout << "|\n--------------------------------------------------\n";

    time = 0;
    for (const auto& segment : gantt_chart) {
        std::cout << time << "\t";
        time += segment.second;
    }
    std::cout << time << "\n";
}

//------------------------------------------------------------
// Helper Function to Plot Gantt Chart
#include "matplotlibcpp.h"

namespace plt = matplotlibcpp;

//------------------------------------------------------------
// Helper Function to Plot Gantt Chart (Updated)
void SchedulingAlgorithm::plotGanttChart() {
    if (gantt_chart.empty()) {
        std::cerr << "Error: Gantt Chart is empty. Cannot plot." << std::endl;
        return;
    }

    std::vector<double> startTimes;
    std::vector<double> durations;
    std::vector<double> y_positions;
    std::vector<std::string> labels;

    double time = gantt_chart[0].first; // Start at the first process's arrival
    int y = 0;

    for (const auto& segment : gantt_chart) {
        if (segment.second <= 0) continue;

        startTimes.push_back(time);               // Start at the correct time
        durations.push_back(segment.second);      // Process burst duration
        y_positions.push_back(y);                 // Y-axis position
        labels.push_back("P" + std::to_string(segment.first));

        time += segment.second; // Move to next time slot
        y++;
    }

    // Plotting the Gantt Chart (No idle blocks, just shifting)
    std::vector<double> xs, ys;
    double halfHeight = 0.25; // Controls bar thickness

    for (size_t i = 0; i < y_positions.size(); i++) {
        xs = {startTimes[i], startTimes[i] + durations[i],
              startTimes[i] + durations[i], startTimes[i]};
        ys = {y_positions[i] - halfHeight, y_positions[i] - halfHeight,
              y_positions[i] + halfHeight, y_positions[i] + halfHeight};
        plt::fill(xs, ys, {{"color", "skyblue"}});
    }

    plt::yticks(y_positions, labels);
    plt::xlabel("Time");
    plt::ylabel("Processes");
    plt::title("Gantt Chart for CPU Scheduling");
    plt::grid(true);

    plt::show();
}







//------------------------------------------------------------
// Helper Function to Print Metrics
void SchedulingAlgorithm::printMetrics(const std::vector<Process>& processes) {
    double totalTAT = 0, totalWT = 0, totalRT = 0;
    int totalBurstTime = 0, completionTime = 0;

    std::cout << "\n===================================================================================\n";
    std::cout << "| Process | Arrival | Burst | Priority | Finish | Turnaround | Waiting | Response |\n";
    std::cout << "-----------------------------------------------------------------------------------\n";

    for (const auto& process : processes) {
        int tat = process.getFinishTime() - process.getArrivalTime();
        int wt = tat - process.getBurstTime();
        int rt = process.getStartTime() - process.getArrivalTime();

        totalTAT += tat;
        totalWT += wt;
        totalRT += rt;
        totalBurstTime += process.getBurstTime();
        completionTime = std::max(completionTime, process.getFinishTime());

        std::cout << "| " << std::setw(7) << "P" + std::to_string(process.getId()) 
                  << " | " << std::setw(7) << process.getArrivalTime() 
                  << " | " << std::setw(5) << process.getBurstTime() 
                  << " | " << std::setw(8) << process.getPriority() 
                  << " | " << std::setw(6) << process.getFinishTime() 
                  << " | " << std::setw(10) << tat 
                  << " | " << std::setw(7) << wt 
                  << " | " << std::setw(8) << rt 
                  << " |\n";
    }

    std::cout << "===================================================================================\n";
    std::cout << "Average Turnaround Time: " << std::fixed << std::setprecision(2) << (totalTAT / processes.size()) << "\n";
    std::cout << "Average Waiting Time: " << std::fixed << std::setprecision(2) << (totalWT / processes.size()) << "\n";
    std::cout << "Average Response Time: " << std::fixed << std::setprecision(2) << (totalRT / processes.size()) << "\n";
    std::cout << "CPU Utilization: " << std::fixed << std::setprecision(2) 
              << ((totalBurstTime / (double)completionTime) * 100) << "%\n";
}

//------------------------------------------------------------
// FCFS Implementation
void FCFS::schedule(std::vector<Process>& processes) {
    gantt_chart.clear();
    int current_time = 0;

    for (auto& process : processes) {
        if (current_time < process.getArrivalTime())
            current_time = process.getArrivalTime();

        process.setStartTime(current_time);
        current_time += process.getBurstTime();
        process.setFinishTime(current_time);
        process.setTurnaroundTime(process.getFinishTime() - process.getArrivalTime());
        process.setWaitingTime(process.getStartTime() - process.getArrivalTime());

        gantt_chart.push_back({process.getId(), process.getBurstTime()});
    }
}

//------------------------------------------------------------
// Shortest Job First (Non-Preemptive)
void SJF::schedule(std::vector<Process>& processes) {
    gantt_chart.clear();
    std::sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
        return a.getBurstTime() < b.getBurstTime();
    });

    int current_time = 0;
    for (auto& process : processes) {
        if (current_time < process.getArrivalTime())
            current_time = process.getArrivalTime();

        process.setStartTime(current_time);
        current_time += process.getBurstTime();
        process.setFinishTime(current_time);
        process.setTurnaroundTime(process.getFinishTime() - process.getArrivalTime());
        process.setWaitingTime(process.getStartTime() - process.getArrivalTime());

        gantt_chart.push_back({process.getId(), process.getBurstTime()});
    }
}

//------------------------------------------------------------
// Preemptive Shortest Job First (SJF)
void PreemptiveSJF::schedule(std::vector<Process>& processes) {
    gantt_chart.clear();
    std::sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
        return a.getArrivalTime() < b.getArrivalTime();
    });

    auto cmp = [](Process* a, Process* b) { return a->getRemainingTime() > b->getRemainingTime(); };
    std::priority_queue<Process*, std::vector<Process*>, decltype(cmp)> ready_queue(cmp);

    int current_time = 0, completed = 0;
    size_t idx = 0;

    while (completed < processes.size()) {
        while (idx < processes.size() && processes[idx].getArrivalTime() <= current_time) {
            ready_queue.push(&processes[idx]);
            idx++;
        }

        if (!ready_queue.empty()) {
            Process* proc = ready_queue.top();
            ready_queue.pop();
            proc->setRemainingTime(proc->getRemainingTime() - 1);
            gantt_chart.push_back({proc->getId(), 1});
            current_time++;

            if (proc->getRemainingTime() == 0) {
                proc->setFinishTime(current_time);
                proc->setTurnaroundTime(proc->getFinishTime() - proc->getArrivalTime());
                proc->setWaitingTime(proc->getTurnaroundTime() - proc->getBurstTime());
                completed++;
            } else {
                ready_queue.push(proc);
            }
        } else {
            current_time++;
        }
    }
}

//------------------------------------------------------------
// Priority Scheduling (Non-Preemptive)
void PriorityScheduling::schedule(std::vector<Process>& processes) {
    gantt_chart.clear();
    std::sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
        return a.getPriority() < b.getPriority();
    });

    int current_time = 0;
    for (auto& process : processes) {
        if (current_time < process.getArrivalTime())
            current_time = process.getArrivalTime();

        process.setStartTime(current_time);
        current_time += process.getBurstTime();
        process.setFinishTime(current_time);
        process.setTurnaroundTime(process.getFinishTime() - process.getArrivalTime());
        process.setWaitingTime(process.getStartTime() - process.getArrivalTime());

        gantt_chart.push_back({process.getId(), process.getBurstTime()});
    }
}

//------------------------------------------------------------
// Preemptive Priority Scheduling
void PreemptivePriorityScheduling::schedule(std::vector<Process>& processes) {
    gantt_chart.clear();
    std::sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
        return a.getArrivalTime() < b.getArrivalTime();
    });

    auto cmp = [](Process* a, Process* b) { return a->getPriority() > b->getPriority(); };
    std::priority_queue<Process*, std::vector<Process*>, decltype(cmp)> ready_queue(cmp);

    int current_time = 0, completed = 0;
    size_t idx = 0;

    while (completed < processes.size()) {
        while (idx < processes.size() && processes[idx].getArrivalTime() <= current_time) {
            ready_queue.push(&processes[idx]);
            idx++;
        }

        if (!ready_queue.empty()) {
            Process* proc = ready_queue.top();
            ready_queue.pop();
            proc->setRemainingTime(proc->getRemainingTime() - 1);
            gantt_chart.push_back({proc->getId(), 1});
            current_time++;

            if (proc->getRemainingTime() == 0) {
                proc->setFinishTime(current_time);
                proc->setTurnaroundTime(proc->getFinishTime() - proc->getArrivalTime());
                proc->setWaitingTime(proc->getTurnaroundTime() - proc->getBurstTime());
                completed++;
            } else {
                ready_queue.push(proc);
            }
        } else {
            current_time++;
        }
    }
}

//------------------------------------------------------------
// Round Robin Scheduling
void RoundRobin::schedule(std::vector<Process>& processes) {
    gantt_chart.clear();
    std::queue<Process*> ready_queue;
    int current_time = 0;

    for (auto& process : processes) {
        process.setRemainingTime(process.getBurstTime());
    }

    size_t idx = 0;
    while (idx < processes.size() || !ready_queue.empty()) {
        while (idx < processes.size() && processes[idx].getArrivalTime() <= current_time) {
            ready_queue.push(&processes[idx]);
            idx++;
        }

        if (!ready_queue.empty()) {
            Process* proc = ready_queue.front();
            ready_queue.pop();
            int exec_time = std::min(time_quantum, proc->getRemainingTime());
            gantt_chart.push_back({proc->getId(), exec_time});
            current_time += exec_time;
            proc->setRemainingTime(proc->getRemainingTime() - exec_time);

            if (proc->getRemainingTime() > 0) {
                ready_queue.push(proc);
            }
        } else {
            current_time++;
        }
    }
}


void RoundRobin::plotGanttChart() {
    SchedulingAlgorithm::plotGanttChart();  // Call base class function
}
void RoundRobin::printGanttChart() {
    SchedulingAlgorithm::printGanttChart();  // Call base class function
}
// void RoundRobin::printMetrics(const std::vector<Process>& processes) {
//     SchedulingAlgorithm::printMetrics(processes);  // Call base class function
// }
void PreemptiveSJF::printMetrics(const std::vector<Process>& processes) {
    SchedulingAlgorithm::printMetrics(processes);  // Call base class function
}
void PreemptiveSJF::plotGanttChart() {
    SchedulingAlgorithm::plotGanttChart();  // Call base class function
}
void PreemptiveSJF::printGanttChart() {
    SchedulingAlgorithm::printGanttChart();  // Call base class function
}
void PriorityScheduling::printMetrics(const std::vector<Process>& processes) {
    SchedulingAlgorithm::printMetrics(processes);  // Call base class function
}
void PriorityScheduling::plotGanttChart() {
    SchedulingAlgorithm::plotGanttChart();  // Call base class function
}
void PriorityScheduling::printGanttChart() {
    SchedulingAlgorithm::printGanttChart();  // Call base class function
}
void PreemptivePriorityScheduling::printGanttChart() {
    SchedulingAlgorithm::printGanttChart();  // Use base class function
}
void PreemptivePriorityScheduling::plotGanttChart() {
    SchedulingAlgorithm::plotGanttChart();  // Use base class function
}
void PreemptivePriorityScheduling::printMetrics(const std::vector<Process>& processes) {
    SchedulingAlgorithm::printMetrics(processes);  // Use base class function
}
void SJF::printGanttChart() {
    SchedulingAlgorithm::printGanttChart();  // Use base class function
}
void SJF::plotGanttChart() {
    SchedulingAlgorithm::plotGanttChart();  // Use base class function
}
void SJF::printMetrics(const std::vector<Process>& processes) {
    SchedulingAlgorithm::printMetrics(processes);  // Use base class function
}
void FCFS::printGanttChart() {
    SchedulingAlgorithm::printGanttChart();  // Use base class function
}
void FCFS::plotGanttChart() {
    SchedulingAlgorithm::plotGanttChart();  // Use base class function
}
void FCFS::printMetrics(const std::vector<Process>& processes) {
    SchedulingAlgorithm::printMetrics(processes);  // Use base class function
}