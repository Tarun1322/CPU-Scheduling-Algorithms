#include <iostream>
#include <vector>
#include <memory>
#include "process.h"
#include "scheduler.h"

int main() {
    int num_processes;
    std::cout << "Enter the number of processes: ";
    std::cin >> num_processes;

    if (num_processes <= 0) {
        std::cerr << "Invalid number of processes! Exiting...\n";
        return 1;
    }

    std::cout << "Choose scheduling algorithm:\n";
    std::cout << "1. FCFS\n2. SJF\n3. Preemptive SJF\n4. Priority Scheduling\n5. Preemptive Priority Scheduling\n6. Round Robin\n";
    
    int choice;
    std::cin >> choice;

    bool is_priority_scheduling = (choice == 4 || choice == 5); // Only ask for priority in these cases

    std::vector<Process> processes;
    for (int i = 0; i < num_processes; ++i) {
        int arrival, burst, prio = 0; // Default priority = 0 (ignored for non-priority algorithms)

        std::cout << "\nProcess " << i + 1 << ":\n";

        do {
            std::cout << "Arrival Time: ";
            std::cin >> arrival;
            if (arrival < 0) std::cerr << "Arrival time cannot be negative! Try again.\n";
        } while (arrival < 0);

        do {
            std::cout << "Burst Time: ";
            std::cin >> burst;
            if (burst <= 0) std::cerr << "Burst time must be greater than zero! Try again.\n";
        } while (burst <= 0);

        if (is_priority_scheduling) { // Ask for priority ONLY if needed
            do {
                std::cout << "Priority: ";
                std::cin >> prio;
                if (prio < 0) std::cerr << "Priority cannot be negative! Try again.\n";
            } while (prio < 0);
        }

        processes.emplace_back(i + 1, arrival, burst, prio);
    }

    std::unique_ptr<SchedulingAlgorithm> scheduler;

    switch (choice) {
        case 1: scheduler = std::make_unique<FCFS>(); break;
        case 2: scheduler = std::make_unique<SJF>(); break;
        case 3: scheduler = std::make_unique<PreemptiveSJF>(); break;
        case 4: scheduler = std::make_unique<PriorityScheduling>(); break;
        case 5: scheduler = std::make_unique<PreemptivePriorityScheduling>(); break;
        case 6: {
            int tq;
            do {
                std::cout << "Enter time quantum: ";
                std::cin >> tq;
                if (tq <= 0) std::cerr << "Time quantum must be greater than zero! Try again.\n";
            } while (tq <= 0);
            scheduler = std::make_unique<RoundRobin>(tq);
            break;
        }
        default:
            std::cerr << "Invalid choice! Exiting...\n";
            return 1;
    }

    scheduler->schedule(processes);
    scheduler->printGanttChart();
    scheduler->plotGanttChart(); // New visualization
    scheduler->printMetrics(processes);
    return 0;
}
