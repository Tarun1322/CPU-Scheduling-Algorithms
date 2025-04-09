#include "process.h"

// Constructor
Process::Process(int id, int arrival, int burst, int prio)
    : id(id), arrival_time(arrival), burst_time(burst), priority(prio), 
      remaining_time(burst), start_time(-1), finish_time(-1), 
      waiting_time(-1), turnaround_time(-1), 
      completion_time(-1), response_time(-1) {} // ✅ Added completion_time & response_time

// Getters
int Process::getId() const {
    return id;
}

int Process::getArrivalTime() const {
    return arrival_time;
}

int Process::getBurstTime() const {
    return burst_time;
}

int Process::getPriority() const {
    return priority;
}

int Process::getRemainingTime() const {
    return remaining_time;
}

int Process::getStartTime() const {
    return start_time;
}

int Process::getFinishTime() const {
    return finish_time;
}

int Process::getWaitingTime() const {
    return waiting_time;
}

int Process::getTurnaroundTime() const {
    return turnaround_time;
}

int Process::getCompletionTime() const { // ✅ New Getter
    return completion_time;
}

int Process::getResponseTime() const { // ✅ New Getter
    return response_time;
}

// Setters
void Process::setRemainingTime(int time) {
    remaining_time = time;
}

void Process::setStartTime(int time) {
    start_time = time;
}

void Process::setFinishTime(int time) {
    finish_time = time;
}

void Process::setWaitingTime(int time) {
    waiting_time = time;
}

void Process::setTurnaroundTime(int time) {
    turnaround_time = time;
}

void Process::setCompletionTime(int time) { // ✅ New Setter
    completion_time = time;
}

void Process::setResponseTime(int time) { // ✅ New Setter
    response_time = time;
}
