import { calculateFCFS } from './algorithms/fcfs.js';
import { calculateSJF } from './algorithms/sjf.js';
import { calculateSRTF } from './algorithms/srtf.js';
import { calculateRR } from './algorithms/roundRobin.js';
import { calculatePriorityNP, calculatePriorityP } from './algorithms/priority.js';
import { startLiveVisualization, togglePause, resetSimulation } from './visuallive.js';

// Make functions globally available
window.lastResult = null;
window.processInput = processInput;
window.calculateScheduling = calculateScheduling;
window.startLiveSimulation = startLiveSimulation;
window.togglePause = togglePause;
window.resetSimulation = resetSimulation;
window.startLiveVisualization = startLiveVisualization;

let processes = [];
let processCounter = 1;

// Dark mode toggle
const darkModeToggle = document.getElementById('checkbox');
const modeIndicator = document.getElementById('modeIndicator');

darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    modeIndicator.textContent = darkModeToggle.checked ? 'Dark Mode' : 'Light Mode';
});

// Check for saved user preference
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
    modeIndicator.textContent = 'Dark Mode';
}

// Save user preference
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', null);
    }
});

// Reset algorithm selection on page load
window.addEventListener('load', () => {
    document.getElementById('algorithm').selectedIndex = 0;
    document.getElementById('batchInput').value = '';
    document.getElementById('priorityValues').value = '';
    processes = [];
    processCounter = 1;
    updateProcessTable();
    resetSimulation();
});

// Show/hide inputs based on algorithm selection
document.getElementById('algorithm').addEventListener('change', function() {
    const priorityInput = document.getElementById('priorityInput');
    const timeQuantumInput = document.getElementById('timeQuantumInput');
    const priorityColumn = document.querySelectorAll('.priority-column');
    
    priorityInput.style.display = 'none';
    timeQuantumInput.style.display = 'none';
    priorityColumn.forEach(el => el.style.display = 'none');

    if (this.value.includes('priority')) {
        priorityInput.style.display = 'block';
        priorityColumn.forEach(el => el.style.display = 'table-cell');
    } else if (this.value === 'rr') {
        timeQuantumInput.style.display = 'block';
    }
    
    updateProcessTable();
});

function processInput() {
    const arrivalTimes = document.getElementById('arrivalInput').value.trim().split(/\s+/).map(Number);
    const burstTimes = document.getElementById('burstInput').value.trim().split(/\s+/).map(Number);
    const priorityValues = document.getElementById('algorithm').value.includes('priority') ?
        document.getElementById('priorityValues').value.trim().split(/\s+/).map(Number) : [];
    
    processes = [];
    processCounter = 1;

    if (burstTimes.length !== arrivalTimes.length) {
        alert('Number of arrival times and burst times must match!');
        return;
    }

    if (priorityValues.length > 0 && priorityValues.length !== arrivalTimes.length) {
        alert('Number of priority values must match number of processes!');
        return;
    }

    if (arrivalTimes.some(isNaN) || burstTimes.some(isNaN) || burstTimes.some(x => x <= 0)) {
        alert('Invalid input! Please enter valid numbers.');
        return;
    }

    for (let i = 0; i < arrivalTimes.length; i++) {
        processes.push({
            id: processCounter++,
            arrivalTime: arrivalTimes[i],
            burstTime: burstTimes[i],
            remainingTime: burstTimes[i],
            priority: priorityValues[i] || 0,
            startTime: -1,
            finishTime: -1,
            turnaroundTime: 0,
            waitingTime: 0,
            responseTime: -1
        });
    }

    updateProcessTable();
}

function addProcess() {
    const arrivalTime = parseInt(document.getElementById('arrivalTime').value);
    const burstTime = parseInt(document.getElementById('burstTime').value);
    const priority = parseInt(document.getElementById('priority').value) || 0;

    if (isNaN(arrivalTime) || isNaN(burstTime)) {
        alert('Please enter valid numbers');
        return;
    }

    processes.push({
        id: processCounter++,
        arrivalTime,
        burstTime,
        remainingTime: burstTime,
        priority,
        startTime: -1,
        finishTime: -1,
        turnaroundTime: 0,
        waitingTime: 0,
        responseTime: -1
    });

    updateProcessTable();
    clearInputs();
}

function clearInputs() {
    document.getElementById('arrivalTime').value = '';
    document.getElementById('burstTime').value = '';
}

function updateProcessTable() {
    const tbody = document.getElementById('processTableBody');
    const algorithm = document.getElementById('algorithm').value;
    tbody.innerHTML = '';

    processes.forEach(process => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>P${process.id}</td>
            <td>${process.arrivalTime}</td>
            <td>${process.burstTime}</td>
            ${algorithm.includes('priority') ? `<td class="priority-column">${process.priority}</td>` : ''}
        `;
        tbody.appendChild(row);
    });
}

async function calculateScheduling() {
    // window.lastResult = result;
    if (processes.length === 0) {
        alert('Please add processes first');
        return;
    }

    const algorithm = document.getElementById('algorithm').value;
    const algorithmNames = {
        'fcfs': 'First Come First Served (FCFS)',
        'sjf': 'Shortest Job First (Non-preemptive)',
        'srtf': 'Shortest Remaining Time First (Preemptive)',
        'rr': 'Round Robin',
        'priority-np': 'Priority (Non-preemptive)',
        'priority-p': 'Priority (Preemptive)'
    };
    
    document.getElementById('currentAlgorithm').textContent = algorithmNames[algorithm];
    
    let result;
    
    try {
        switch(algorithm) {
            case 'fcfs':
                result = calculateFCFS(processes);
                break;
            case 'sjf':
                result = calculateSJF(processes);
                break;
            case 'srtf':
                result = calculateSRTF(processes);
                break;
            case 'rr':
                const quantum = parseInt(document.getElementById('timeQuantum').value);
                if (isNaN(quantum) || quantum <= 0) {
                    alert('Please enter a valid Time Quantum for Round Robin.');
                    return;
                }
                result = calculateRR(processes, quantum);
                break;
            case 'priority-np':
                result = calculatePriorityNP(processes);
                break;
            case 'priority-p':
                result = calculatePriorityP(processes);
                break;
            default:
                alert('Please select an algorithm');
                return;
        }

        window.lastResult = result;
        displayResults(result.processes);
        createGanttChart(result.timeline);
        resetSimulation();
        
    } catch (error) {
        console.error('Error in calculation:', error);
        alert('Error calculating schedule');
    }
}

function displayResults(processQueue) {
    const resultTable = document.getElementById('resultTable');
    let html = '<table><thead><tr><th>Process</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th><th>Response Time</th></tr></thead><tbody>';

    processQueue.forEach(process => {
        html += `
            <tr>
                <td>P${process.id}</td>
                <td>${process.finishTime}</td>
                <td>${process.turnaroundTime}</td>
                <td>${process.waitingTime}</td>
                <td>${process.responseTime}</td>
            </tr>
        `;
    });

    const validProcesses = processQueue.filter(p => p.turnaroundTime >= 0);
    const avgTurnaround = validProcesses.length > 0 ?
        (validProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0) / validProcesses.length).toFixed(2) : '0.00';
    const avgWaiting = validProcesses.length > 0 ?
        (validProcesses.reduce((sum, p) => sum + p.waitingTime, 0) / validProcesses.length).toFixed(2) : '0.00';
    const avgResponse = validProcesses.length > 0 ?
        (validProcesses.reduce((sum, p) => sum + p.responseTime, 0) / validProcesses.length).toFixed(2) : '0.00';

    html += `</tbody></table>
        <div class="averages">
            <table class="averages-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Average Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Turnaround Time</td>
                        <td>${avgTurnaround}</td>
                    </tr>
                    <tr>
                        <td>Waiting Time</td>
                        <td>${avgWaiting}</td>
                    </tr>
                    <tr>
                        <td>Response Time</td>
                        <td>${avgResponse}</td>
                    </tr>
                </tbody>
            </table>
        </div>`;

    resultTable.innerHTML = html;
}

function createGanttChart(timeline) {
    const ganttChart = document.getElementById('ganttChart');
    ganttChart.innerHTML = '';

    timeline.forEach(block => {
        const div = document.createElement('div');
        div.className = 'gantt-block';
        
        if (block.processId === 'idle') {
            div.classList.add('idle');
            div.innerHTML = `
                <div>Idle</div>
                <div>${block.startTime}-${block.endTime}</div>
            `;
        } else {
            div.style.backgroundColor = `hsl(${(block.processId * 137.5) % 360}, 70%, 70%)`;
            div.innerHTML = `
                <div>P${block.processId}</div>
                <div>${block.startTime}-${block.endTime}</div>
            `;
        }
        
        ganttChart.appendChild(div);
    });

    ganttChart.scrollLeft = 0;
}

function startLiveSimulation() {
    if(window.lastResult) {
        startLiveVisualization(window.lastResult);
    } else {
        alert('Please calculate schedule first');
    }
}