#ifndef SCHEDULER_H
#define SCHEDULER_H

#include <vector>
#include "process.h"
#include "matplotlibcpp.h"  // Include Matplotlib for visualization

namespace plt = matplotlibcpp;

// Abstract base class for scheduling algorithms
class SchedulingAlgorithm {
    public:
        virtual void schedule(std::vector<Process>& processes) = 0;
        virtual void printGanttChart() = 0;
        virtual void plotGanttChart() = 0;
        
        // ✅ Make printMetrics a virtual function with override
        virtual void printMetrics(const std::vector<Process>& processes) ;
    
        virtual ~SchedulingAlgorithm() = default;
    
    protected:
        std::vector<std::pair<int, int>> gantt_chart;
    };

// All scheduling algorithms
class FCFS : public SchedulingAlgorithm {
public:
    void schedule(std::vector<Process>& processes) override;
    void printGanttChart() override;
    void plotGanttChart() override;
    void printMetrics(const std::vector<Process>& processes) override;
};

class SJF : public SchedulingAlgorithm {
public:
    void schedule(std::vector<Process>& processes) override;
    void printGanttChart() override;
    void plotGanttChart() override;
    void printMetrics(const std::vector<Process>& processes) override;
};

class PreemptiveSJF : public SchedulingAlgorithm {
public:
    void schedule(std::vector<Process>& processes) override;
    void printGanttChart() override;
    void plotGanttChart() override;
    void printMetrics(const std::vector<Process>& processes) override;
};

class PriorityScheduling : public SchedulingAlgorithm {
public:
    void schedule(std::vector<Process>& processes) override;
    void printGanttChart() override;
    void plotGanttChart() override;
    void printMetrics(const std::vector<Process>& processes) override;
};

class PreemptivePriorityScheduling : public SchedulingAlgorithm {
public:
    void schedule(std::vector<Process>& processes) override;
    void printGanttChart() override;
    void plotGanttChart() override;
    void printMetrics(const std::vector<Process>& processes) override;
};

class RoundRobin : public SchedulingAlgorithm {
    private:
        int time_quantum;
    public:
        explicit RoundRobin(int tq) : time_quantum(tq) {}
        void schedule(std::vector<Process>& processes) override;
        void printGanttChart() override;
        void plotGanttChart() override;
    };
    

#endif // SCHEDULER_H
