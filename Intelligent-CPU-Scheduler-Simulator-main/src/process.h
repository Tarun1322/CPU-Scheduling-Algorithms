#ifndef PROCESS_H
#define PROCESS_H

class Process {
private:
    int id;
    int arrival_time;
    int burst_time;
    int priority;
    int remaining_time;  // For preemptive algorithms
    int start_time;      
    int finish_time;     
    int waiting_time;    
    int turnaround_time; 
    int completion_time; // ✅ Added Completion Time
    int response_time;   // ✅ Added Response Time

public:
    Process(int id, int arrival, int burst, int prio);

    // Getters
    int getId() const;
    int getArrivalTime() const;
    int getBurstTime() const;
    int getPriority() const;
    int getRemainingTime() const;
    int getStartTime() const;
    int getFinishTime() const;
    int getWaitingTime() const;
    int getTurnaroundTime() const;
    int getCompletionTime() const; // ✅ New Getter
    int getResponseTime() const;   // ✅ New Getter

    // Setters
    void setRemainingTime(int time);
    void setStartTime(int time);
    void setFinishTime(int time);
    void setWaitingTime(int time);
    void setTurnaroundTime(int time);
    void setCompletionTime(int time); // ✅ New Setter
    void setResponseTime(int time);   // ✅ New Setter
};

#endif // PROCESS_H
