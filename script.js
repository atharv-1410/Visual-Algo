// Global variables
// Global variables
let array = [];
let arrayBars = [];
let sorting = false;
let paused = false;
let sortingInterval;
let comparisons = 0;
let swaps = 0;
let startTime;
let timer;
let sortingAlgorithm;
let currentIndex = 0;
let currentCompareIndexes = [];
let sortedIndexes = [];

// DOM References
document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to selected tab and content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }
    
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
    
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            darkModeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    }

    // Linear Search Implementation
    const linearStartBtn = document.getElementById('linear-start');
    const linearNextBtn = document.getElementById('linear-next');
    const linearResetBtn = document.getElementById('linear-reset');
    const linearArrayInput = document.getElementById('linear-array');
    const linearTargetInput = document.getElementById('linear-target');
    const linearArrayContainer = document.getElementById('linear-array-container');
    const linearResult = document.getElementById('linear-result');
    const linearSteps = document.getElementById('linear-steps');
    const linearComparisons = document.getElementById('linear-comparisons');

    let linearArray = [];
    let linearTarget = 0;
    let linearCurrentIndex = -1;
    let linearFound = false;
    let linearSearchComplete = false;
    let linearStepsCount = 0;
    let linearComparisonsCount = 0;

    linearStartBtn.addEventListener('click', startLinearSearch);
    linearNextBtn.addEventListener('click', linearSearchStep);
    linearResetBtn.addEventListener('click', resetLinearSearch);

    function startLinearSearch() {
        resetLinearSearch();
        
        // Parse array from input
        const inputArray = linearArrayInput.value.split(',').map(item => parseInt(item.trim()));
        linearArray = inputArray.filter(item => !isNaN(item));
        
        // Get target value
        linearTarget = parseInt(linearTargetInput.value);
        
        if (linearArray.length === 0 || isNaN(linearTarget)) {
            linearResult.innerHTML = '<p class="error">Please enter valid array and target values.</p>';
            return;
        }
        
        // Render array elements
        renderLinearArray();
        
        // Update UI state
        linearStartBtn.disabled = true;
        linearNextBtn.disabled = false;
        linearResult.innerHTML = '<p>Search started. Click "Next Step" to proceed.</p>';
    }

    function linearSearchStep() {
        if (linearSearchComplete) return;
        
        linearStepsCount++;
        linearSteps.textContent = linearStepsCount;
        
        // Move to next element
        linearCurrentIndex++;
        
        if (linearCurrentIndex < linearArray.length) {
            // Update visualization
            updateLinearArrayDisplay();
            
            // Perform comparison
            linearComparisonsCount++;
            linearComparisons.textContent = linearComparisonsCount;
            
            if (linearArray[linearCurrentIndex] === linearTarget) {
                linearFound = true;
                linearSearchComplete = true;
                linearResult.innerHTML = `<p class="success">Target ${linearTarget} found at index ${linearCurrentIndex}!</p>`;
                linearNextBtn.disabled = true;
                
                // Update visualization for found element
                const elements = linearArrayContainer.querySelectorAll('.array-element');
                elements[linearCurrentIndex].classList.add('found');
            } else {
                linearResult.innerHTML = `<p>Checking element at index ${linearCurrentIndex}: ${linearArray[linearCurrentIndex]} != ${linearTarget}</p>`;
            }
        } else {
            // Search complete, element not found
            linearSearchComplete = true;
            linearResult.innerHTML = `<p class="error">Target ${linearTarget} not found in the array.</p>`;
            linearNextBtn.disabled = true;
        }
    }

    function resetLinearSearch() {
        linearArray = [];
        linearTarget = 0;
        linearCurrentIndex = -1;
        linearFound = false;
        linearSearchComplete = false;
        linearStepsCount = 0;
        linearComparisonsCount = 0;
        
        // Reset UI
        linearArrayContainer.innerHTML = '';
        linearResult.innerHTML = '';
        linearSteps.textContent = '0';
        linearComparisons.textContent = '0';
        linearStartBtn.disabled = false;
        linearNextBtn.disabled = true;
    }

    function renderLinearArray() {
        linearArrayContainer.innerHTML = '';
        
        linearArray.forEach((value, index) => {
            const element = document.createElement('div');
            element.className = 'array-element';
            element.textContent = value;
            element.setAttribute('data-index', index);
            linearArrayContainer.appendChild(element);
        });
    }

    function updateLinearArrayDisplay() {
        // Reset all elements
        const elements = linearArrayContainer.querySelectorAll('.array-element');
        elements.forEach(el => {
            el.classList.remove('current', 'found', 'not-found');
        });
        
        // Mark current element
        if (linearCurrentIndex >= 0 && linearCurrentIndex < elements.length) {
            elements[linearCurrentIndex].classList.add('current');
        }
        
        // Mark previously checked elements as not found
        for (let i = 0; i < linearCurrentIndex; i++) {
            elements[i].classList.add('not-found');
        }
    }

    // Binary Search Implementation
    const binaryStartBtn = document.getElementById('binary-start');
    const binaryNextBtn = document.getElementById('binary-next');
    const binaryResetBtn = document.getElementById('binary-reset');
    const binaryArrayInput = document.getElementById('binary-array');
    const binaryTargetInput = document.getElementById('binary-target');
    const binaryArrayContainer = document.getElementById('binary-array-container');
    const binaryResult = document.getElementById('binary-result');
    const binarySteps = document.getElementById('binary-steps');
    const binaryComparisons = document.getElementById('binary-comparisons');
    const binaryRange = document.getElementById('binary-range');

    let binaryArray = [];
    let binaryTarget = 0;
    let binaryLeft = 0;
    let binaryRight = 0;
    let binaryMid = 0;
    let binaryFound = false;
    let binarySearchComplete = false;
    let binaryStepsCount = 0;
    let binaryComparisonsCount = 0;
    let eliminatedElements = [];

    binaryStartBtn.addEventListener('click', startBinarySearch);
    binaryNextBtn.addEventListener('click', binarySearchStep);
    binaryResetBtn.addEventListener('click', resetBinarySearch);

    function startBinarySearch() {
        resetBinarySearch();
        
        // Parse array from input and sort it
        const inputArray = binaryArrayInput.value.split(',').map(item => parseInt(item.trim()));
        binaryArray = inputArray.filter(item => !isNaN(item)).sort((a, b) => a - b);
        
        // Get target value
        binaryTarget = parseInt(binaryTargetInput.value);
        
        if (binaryArray.length === 0 || isNaN(binaryTarget)) {
            binaryResult.innerHTML = '<p class="error">Please enter valid array and target values.</p>';
            return;
        }
        
        // Initialize search boundaries
        binaryLeft = 0;
        binaryRight = binaryArray.length - 1;
        
        // Render sorted array elements
        renderBinaryArray();
        
        // Update UI state
        binaryStartBtn.disabled = true;
        binaryNextBtn.disabled = false;
        binaryResult.innerHTML = '<p>Search started with sorted array. Click "Next Step" to proceed.</p>';
        binaryRange.textContent = `${binaryLeft} to ${binaryRight}`;
    }

    function binarySearchStep() {
        if (binarySearchComplete) return;
        
        binaryStepsCount++;
        binarySteps.textContent = binaryStepsCount;
        
        if (binaryLeft <= binaryRight) {
            // Calculate middle index
            binaryMid = Math.floor((binaryLeft + binaryRight) / 2);
            
            // Update visualization
            updateBinaryArrayDisplay();
            
            // Perform comparison
            binaryComparisonsCount++;
            binaryComparisons.textContent = binaryComparisonsCount;
            
            if (binaryArray[binaryMid] === binaryTarget) {
                // Element found
                binaryFound = true;
                binarySearchComplete = true;
                binaryResult.innerHTML = `<p class="success">Target ${binaryTarget} found at index ${binaryMid}!</p>`;
                binaryNextBtn.disabled = true;
                
                // Update visualization for found element
                const elements = binaryArrayContainer.querySelectorAll('.array-element');
                elements[binaryMid].classList.add('found');
            } else if (binaryArray[binaryMid] < binaryTarget) {
                // Search in right half
                binaryResult.innerHTML = `<p>Middle element ${binaryArray[binaryMid]} < target ${binaryTarget}. Moving to right half.</p>`;
                
                // Mark left half as eliminated
                for (let i = binaryLeft; i <= binaryMid; i++) {
                    eliminatedElements.push(i);
                }
                
                binaryLeft = binaryMid + 1;
            } else {
                // Search in left half
                binaryResult.innerHTML = `<p>Middle element ${binaryArray[binaryMid]} > target ${binaryTarget}. Moving to left half.</p>`;
                
                // Mark right half as eliminated
                for (let i = binaryMid; i <= binaryRight; i++) {
                    eliminatedElements.push(i);
                }
                
                binaryRight = binaryMid - 1;
            }
            
            // Update range display
            binaryRange.textContent = binaryLeft <= binaryRight ? `${binaryLeft} to ${binaryRight}` : 'N/A';
        } else {
            // Element not found
            binarySearchComplete = true;
            binaryResult.innerHTML = `<p class="error">Target ${binaryTarget} not found in the array.</p>`;
            binaryNextBtn.disabled = true;
            binaryRange.textContent = 'N/A';
        }
    }

    function resetBinarySearch() {
        binaryArray = [];
        binaryTarget = 0;
        binaryLeft = 0;
        binaryRight = 0;
        binaryMid = 0;
        binaryFound = false;
        binarySearchComplete = false;
        binaryStepsCount = 0;
        binaryComparisonsCount = 0;
        eliminatedElements = [];
        
        // Reset UI
        binaryArrayContainer.innerHTML = '';
        binaryResult.innerHTML = '';
        binarySteps.textContent = '0';
        binaryComparisons.textContent = '0';
        binaryRange.textContent = 'N/A';
        binaryStartBtn.disabled = false;
        binaryNextBtn.disabled = true;
    }

    function renderBinaryArray() {
        binaryArrayContainer.innerHTML = '';
        
        binaryArray.forEach((value, index) => {
            const element = document.createElement('div');
            element.className = 'array-element';
            element.textContent = value;
            element.setAttribute('data-index', index);
            binaryArrayContainer.appendChild(element);
        });
    }

    function updateBinaryArrayDisplay() {
        // Reset all elements
        const elements = binaryArrayContainer.querySelectorAll('.array-element');
        elements.forEach((el, index) => {
            el.classList.remove('current', 'found');
            
            // Mark eliminated elements
            if (eliminatedElements.includes(index)) {
                el.classList.add('not-found');
            } else {
                el.classList.remove('not-found');
            }
        });
        
        // Mark current middle element
        if (binaryMid >= 0 && binaryMid < elements.length) {
            elements[binaryMid].classList.add('current');
        }
    }

    // Initialize the page
    resetLinearSearch();
    resetBinarySearch();
});

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and corresponding content
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navUl = document.querySelector('nav ul');

    mobileMenuToggle.addEventListener('click', function() {
        navUl.classList.toggle('show');
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkModeToggle.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            darkModeToggle.textContent = '🌙';
        }
    });

    // Graph Class
    class Graph {
        constructor(container, connectionLine) {
            this.container = container;
            this.connectionLine = connectionLine;
            this.nodes = [];
            this.edges = [];
            this.nextNodeId = 0;
            this.mode = 'add-node';
            this.tempEdgeStart = null;
            
            // Initialize container event listeners
            this.initContainerEvents();
        }

        initContainerEvents() {
            // Click event for adding nodes or connecting edges
            this.container.addEventListener('click', (e) => {
                if (e.target === this.container) {
                    if (this.mode === 'add-node') {
                        this.addNode(e.offsetX, e.offsetY);
                    }
                }
            });

            // Mouse move for edge visualization during creation
            this.container.addEventListener('mousemove', (e) => {
                if (this.mode === 'add-edge' && this.tempEdgeStart) {
                    const rect = this.container.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    this.updateConnectionLine(this.tempEdgeStart.x, this.tempEdgeStart.y, x, y);
                    this.connectionLine.style.display = 'block';
                }
            });
        }

        setMode(mode) {
            this.mode = mode;
            this.tempEdgeStart = null;
            this.connectionLine.style.display = 'none';
        }

        addNode(x, y) {
            const nodeId = this.nextNodeId++;
            const node = {
                id: nodeId,
                x: x,
                y: y,
                element: this.createNodeElement(nodeId, x, y)
            };
            
            this.nodes.push(node);
            this.container.appendChild(node.element);
            this.updateSelectOptions();
            return node;
        }

        createNodeElement(id, x, y) {
            const nodeElement = document.createElement('div');
            nodeElement.className = 'graph-node';
            nodeElement.textContent = id;
            nodeElement.style.left = `${x - 25}px`; // Adjust position to center
            nodeElement.style.top = `${y - 25}px`;
            
            // Node click handler
            nodeElement.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (this.mode === 'add-edge') {
                    if (!this.tempEdgeStart) {
                        // Start drawing edge
                        this.tempEdgeStart = { id: id, x: x, y: y };
                    } else if (this.tempEdgeStart.id !== id) {
                        // Complete edge if not connecting to self
                        this.addEdge(this.tempEdgeStart.id, id);
                        this.tempEdgeStart = null;
                        this.connectionLine.style.display = 'none';
                    }
                } else if (this.mode === 'remove') {
                    this.removeNode(id);
                }
            });
            
            return nodeElement;
        }

        addEdge(fromId, toId) {
            // Check if edge already exists
            const edgeExists = this.edges.some(edge => 
                (edge.from === fromId && edge.to === toId) || 
                (edge.from === toId && edge.to === fromId)
            );
            
            if (!edgeExists) {
                const fromNode = this.getNodeById(fromId);
                const toNode = this.getNodeById(toId);
                
                if (fromNode && toNode) {
                    const edgeElement = this.createEdgeElement(fromNode, toNode);
                    const edge = {
                        from: fromId,
                        to: toId,
                        element: edgeElement
                    };
                    
                    this.edges.push(edge);
                    this.container.insertBefore(edgeElement, this.container.firstChild);
                }
            }
        }

        createEdgeElement(fromNode, toNode) {
            const edgeElement = document.createElement('div');
            edgeElement.className = 'graph-edge';
            
            // Calculate edge position and rotation
            const { left, top, length, angle } = this.calculateEdgeProperties(
                fromNode.x, fromNode.y, toNode.x, toNode.y
            );
            
            edgeElement.style.left = `${left}px`;
            edgeElement.style.top = `${top}px`;
            edgeElement.style.width = `${length}px`;
            edgeElement.style.transform = `rotate(${angle}deg)`;
            
            // Edge click handler for removal
            edgeElement.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.mode === 'remove') {
                    this.removeEdge(fromNode.id, toNode.id);
                }
            });
            
            return edgeElement;
        }

        calculateEdgeProperties(x1, y1, x2, y2) {
            const nodeRadius = 25; // Half of node width/height
            
            // Calculate distance and angle
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy) - (nodeRadius * 2);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            // Adjust start point to be on the edge of start node
            const startX = x1 + nodeRadius * Math.cos(angle * Math.PI / 180);
            const startY = y1 + nodeRadius * Math.sin(angle * Math.PI / 180);
            
            return { left: startX, top: startY, length, angle };
        }

        removeNode(id) {
            // Remove all edges connected to this node
            this.edges = this.edges.filter(edge => {
                if (edge.from === id || edge.to === id) {
                    edge.element.remove();
                    return false;
                }
                return true;
            });
            
            // Remove node
            const nodeIndex = this.nodes.findIndex(node => node.id === id);
            if (nodeIndex !== -1) {
                this.nodes[nodeIndex].element.remove();
                this.nodes.splice(nodeIndex, 1);
            }
            
            this.updateSelectOptions();
        }

        removeEdge(fromId, toId) {
            this.edges = this.edges.filter(edge => {
                if ((edge.from === fromId && edge.to === toId) || 
                    (edge.from === toId && edge.to === fromId)) {
                    edge.element.remove();
                    return false;
                }
                return true;
            });
        }

        updateConnectionLine(x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            this.connectionLine.style.left = `${x1}px`;
            this.connectionLine.style.top = `${y1}px`;
            this.connectionLine.style.width = `${length}px`;
            this.connectionLine.style.transform = `rotate(${angle}deg)`;
        }

        updateSelectOptions() {
            // Update source node select options
            const selects = document.querySelectorAll('#dfs-source, #bfs-source');
            selects.forEach(select => {
                // Save current value
                const currentValue = select.value;
                
                // Clear options
                select.innerHTML = '';
                
                // Add options for each node
                this.nodes.forEach(node => {
                    const option = document.createElement('option');
                    option.value = node.id;
                    option.textContent = `Node ${node.id}`;
                    select.appendChild(option);
                });
                
                // Restore value if it still exists
                if (this.getNodeById(parseInt(currentValue))) {
                    select.value = currentValue;
                }
            });
        }

        getNodeById(id) {
            return this.nodes.find(node => node.id === id);
        }

        getAdjacentNodes(nodeId) {
            const adjacentNodes = [];
            
            this.edges.forEach(edge => {
                if (edge.from === nodeId) {
                    adjacentNodes.push(edge.to);
                } else if (edge.to === nodeId) {
                    adjacentNodes.push(edge.from);
                }
            });
            
            return adjacentNodes;
        }

        resetNodeStyles() {
            this.nodes.forEach(node => {
                node.element.classList.remove('active', 'visited', 'current', 'source');
            });
            
            this.edges.forEach(edge => {
                edge.element.classList.remove('active');
            });
        }

        setNodeStatus(nodeId, status) {
            const node = this.getNodeById(nodeId);
            if (node) {
                // First remove existing status classes
                node.element.classList.remove('active', 'visited', 'current', 'source');
                
                // Add the specified status
                if (status) {
                    node.element.classList.add(status);
                }
            }
        }

        setEdgeStatus(fromId, toId, active) {
            const edge = this.edges.find(edge => 
                (edge.from === fromId && edge.to === toId) || 
                (edge.from === toId && edge.to === fromId)
            );
            
            if (edge) {
                if (active) {
                    edge.element.classList.add('active');
                } else {
                    edge.element.classList.remove('active');
                }
            }
        }

        clear() {
            // Remove all nodes and edges
            this.nodes.forEach(node => node.element.remove());
            this.edges.forEach(edge => edge.element.remove());
            
            this.nodes = [];
            this.edges = [];
            this.nextNodeId = 0;
            this.tempEdgeStart = null;
            this.connectionLine.style.display = 'none';
            
            this.updateSelectOptions();
        }

        loadPresetGraph() {
            this.clear();
            
            // Create nodes with predefined positions
            const node0 = this.addNode(150, 100);
            const node1 = this.addNode(300, 100);
            const node2 = this.addNode(450, 100);
            const node3 = this.addNode(150, 250);
            const node4 = this.addNode(300, 250);
            const node5 = this.addNode(450, 250);
            
            // Create edges to form a connected graph
            this.addEdge(0, 1);
            this.addEdge(0, 3);
            this.addEdge(1, 2);
            this.addEdge(1, 4);
            this.addEdge(2, 5);
            this.addEdge(3, 4);
            this.addEdge(4, 5);
        }
    }

    // DFS Implementation
    class DFSVisualizer {
        constructor(graph) {
            this.graph = graph;
            this.stack = [];
            this.visited = new Set();
            this.traversalPath = [];
            this.currentStep = 0;
            this.sourceNode = null;
            this.isRunning = false;
            this.stackVisualization = document.getElementById('dfs-stack-visualization');
            this.resultContainer = document.getElementById('dfs-result');
            this.traversalPathEl = document.getElementById('dfs-traversal-path');
        }

        start(sourceNodeId) {
            this.reset();
            this.sourceNode = parseInt(sourceNodeId);
            this.isRunning = true;
            
            // Mark source node
            this.graph.setNodeStatus(this.sourceNode, 'source');
            
            // Initialize DFS
            this.stack.push(this.sourceNode);
            this.updateStackVisualization();
            
            // Display initial message
            this.resultContainer.innerHTML = `<p>Started DFS from source node ${this.sourceNode}</p>`;
            
            return true;
        }

        nextStep() {
            if (!this.isRunning || this.stack.length === 0) {
                this.isRunning = false;
                this.resultContainer.innerHTML += `<p>DFS traversal complete!</p>`;
                return false;
            }

            // Get the current node from top of stack
            const currentNode = this.stack[this.stack.length - 1];
            
            // If node is not visited, mark it as visited
            if (!this.visited.has(currentNode)) {
                this.visited.add(currentNode);
                this.traversalPath.push(currentNode);
                this.updateTraversalPath();
                
                // Update GUI
                this.graph.setNodeStatus(currentNode, 'current');
                
                // Get adjacent nodes
                const adjacentNodes = this.graph.getAdjacentNodes(currentNode).sort((a, b) => a - b);
                
                // Push unvisited adjacent nodes to stack
                let hasUnvisitedNeighbors = false;
                for (const neighbor of adjacentNodes) {
                    if (!this.visited.has(neighbor)) {
                        this.stack.push(neighbor);
                        hasUnvisitedNeighbors = true;
                        this.graph.setEdgeStatus(currentNode, neighbor, true);
                        break;
                    }
                }
                
                if (!hasUnvisitedNeighbors) {
                    // No unvisited neighbors, backtrack
                    this.stack.pop();
                    if (currentNode !== this.sourceNode) {
                        this.graph.setNodeStatus(currentNode, 'visited');
                    }
                }
                
                this.resultContainer.innerHTML = `<p>Visiting node ${currentNode}.</p>`;
            } else {
                // All neighbors visited, backtrack
                this.stack.pop();
                if (currentNode !== this.sourceNode) {
                    this.graph.setNodeStatus(currentNode, 'visited');
                }
                this.resultContainer.innerHTML = `<p>Backtracking from node ${currentNode}.</p>`;
            }
            
            this.updateStackVisualization();
            this.currentStep++;
            
            return true;
        }

        reset() {
            this.stack = [];
            this.visited = new Set();
            this.traversalPath = [];
            this.currentStep = 0;
            this.sourceNode = null;
            this.isRunning = false;
            
            // Reset node styles
            this.graph.resetNodeStyles();
            
            // Clear visualization
            this.stackVisualization.innerHTML = '';
            this.resultContainer.innerHTML = '';
            this.traversalPathEl.textContent = '';
        }

        updateStackVisualization() {
            this.stackVisualization.innerHTML = '';
            
            // Show stack in reverse to visualize top of stack on the right
            const stackCopy = [...this.stack].reverse();
            
            for (const nodeId of stackCopy) {
                const item = document.createElement('div');
                item.className = 'data-structure-item';
                item.textContent = nodeId;
                this.stackVisualization.appendChild(item);
            }
        }

        updateTraversalPath() {
            this.traversalPathEl.textContent = this.traversalPath.join(' → ');
        }
    }

    // BFS Implementation
    class BFSVisualizer {
        constructor(graph) {
            this.graph = graph;
            this.queue = [];
            this.visited = new Set();
            this.traversalPath = [];
            this.currentStep = 0;
            this.sourceNode = null;
            this.isRunning = false;
            this.queueVisualization = document.getElementById('bfs-queue-visualization');
            this.resultContainer = document.getElementById('bfs-result');
            this.traversalPathEl = document.getElementById('bfs-traversal-path');
        }

        start(sourceNodeId) {
            this.reset();
            this.sourceNode = parseInt(sourceNodeId);
            this.isRunning = true;
            
            // Mark source node
            this.graph.setNodeStatus(this.sourceNode, 'source');
            
            // Initialize BFS
            this.queue.push(this.sourceNode);
            this.visited.add(this.sourceNode);
            this.traversalPath.push(this.sourceNode);
            this.updateTraversalPath();
            this.updateQueueVisualization();
            
            // Display initial message
            this.resultContainer.innerHTML = `<p>Started BFS from source node ${this.sourceNode}</p>`;
            
            return true;
        }

        nextStep() {
            if (!this.isRunning || this.queue.length === 0) {
                this.isRunning = false;
                this.resultContainer.innerHTML += `<p>BFS traversal complete!</p>`;
                return false;
            }

            // Dequeue current node
            const currentNode = this.queue.shift();
            this.updateQueueVisualization();
            
            // Process current node
            if (currentNode !== this.sourceNode) {
                this.graph.setNodeStatus(currentNode, 'current');
            }
            
            // Get all adjacent nodes
            const adjacentNodes = this.graph.getAdjacentNodes(currentNode).sort((a, b) => a - b);
            
            // Process adjacent nodes
            for (const neighbor of adjacentNodes) {
                if (!this.visited.has(neighbor)) {
                    this.visited.add(neighbor);
                    this.queue.push(neighbor);
                    this.traversalPath.push(neighbor);
                    this.updateTraversalPath();
                    this.graph.setEdgeStatus(currentNode, neighbor, true);
                }
            }
            
            this.updateQueueVisualization();
            
            // Mark current node as visited
            setTimeout(() => {
                if (currentNode !== this.sourceNode) {
                    this.graph.setNodeStatus(currentNode, 'visited');
                }
            }, 500);
            
            this.resultContainer.innerHTML = `<p>Visiting node ${currentNode} and adding unvisited neighbors to queue.</p>`;
            this.currentStep++;
            
            return true;
        }

        reset() {
            this.queue = [];
            this.visited = new Set();
            this.traversalPath = [];
            this.currentStep = 0;
            this.sourceNode = null;
            this.isRunning = false;
            
            // Reset node styles
            this.graph.resetNodeStyles();
            
            // Clear visualization
            this.queueVisualization.innerHTML = '';
            this.resultContainer.innerHTML = '';
            this.traversalPathEl.textContent = '';
        }

        updateQueueVisualization() {
            this.queueVisualization.innerHTML = '';
            
            for (const nodeId of this.queue) {
                const item = document.createElement('div');
                item.className = 'data-structure-item';
                item.textContent = nodeId;
                this.queueVisualization.appendChild(item);
            }
        }

        updateTraversalPath() {
            this.traversalPathEl.textContent = this.traversalPath.join(' → ');
        }
    }

    // Initialize DFS Graph
    const dfsGraphContainer = document.getElementById('dfs-graph-container');
    const dfsConnectionLine = document.getElementById('dfs-connection-line');
    const dfsGraph = new Graph(dfsGraphContainer, dfsConnectionLine);
    const dfsVisualizer = new DFSVisualizer(dfsGraph);

    // Initialize BFS Graph
    const bfsGraphContainer = document.getElementById('bfs-graph-container');
    const bfsConnectionLine = document.getElementById('bfs-connection-line');
    const bfsGraph = new Graph(bfsGraphContainer, bfsConnectionLine);
    const bfsVisualizer = new BFSVisualizer(bfsGraph);

    // Load preset graphs
    dfsGraph.loadPresetGraph();
    bfsGraph.loadPresetGraph();

    // Set up DFS control buttons
    document.getElementById('dfs-start').addEventListener('click', function() {
        const sourceNode = document.getElementById('dfs-source').value;
        if (dfsVisualizer.start(sourceNode)) {
            document.getElementById('dfs-next').disabled = false;
            document.getElementById('dfs-start').disabled = true;
        }
    });

    document.getElementById('dfs-next').addEventListener('click', function() {
        if (!dfsVisualizer.nextStep()) {
            document.getElementById('dfs-next').disabled = true;
        }
    });

    document.getElementById('dfs-reset').addEventListener('click', function() {
        dfsVisualizer.reset();
        document.getElementById('dfs-next').disabled = true;
        document.getElementById('dfs-start').disabled = false;
    });

    document.getElementById('dfs-clear').addEventListener('click', function() {
        dfsGraph.clear();
        dfsVisualizer.reset();
        document.getElementById('dfs-next').disabled = true;
        document.getElementById('dfs-start').disabled = false;
    });

    document.getElementById('dfs-preset').addEventListener('click', function() {
        dfsGraph.loadPresetGraph();
        dfsVisualizer.reset();
        document.getElementById('dfs-next').disabled = true;
        document.getElementById('dfs-start').disabled = false;
    });

    // Set up BFS control buttons
    document.getElementById('bfs-start').addEventListener('click', function() {
        const sourceNode = document.getElementById('bfs-source').value;
        if (bfsVisualizer.start(sourceNode)) {
            document.getElementById('bfs-next').disabled = false;
            document.getElementById('bfs-start').disabled = true;
        }
    });

    document.getElementById('bfs-next').addEventListener('click', function() {
        if (!bfsVisualizer.nextStep()) {
            document.getElementById('bfs-next').disabled = true;
        }
    });

    document.getElementById('bfs-reset').addEventListener('click', function() {
        bfsVisualizer.reset();
        document.getElementById('bfs-next').disabled = true;
        document.getElementById('bfs-start').disabled = false;
    });

    document.getElementById('bfs-clear').addEventListener('click', function() {
        bfsGraph.clear();
        bfsVisualizer.reset();
        document.getElementById('bfs-next').disabled = true;
        document.getElementById('bfs-start').disabled = false;
    });

    document.getElementById('bfs-preset').addEventListener('click', function() {
        bfsGraph.loadPresetGraph();
        bfsVisualizer.reset();
        document.getElementById('bfs-next').disabled = true;
        document.getElementById('bfs-start').disabled = false;
    });

    // Set up mode buttons for both graphs
    const dfsModeBtns = document.querySelectorAll('#dfs .mode-btn');
    dfsModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            dfsModeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            dfsGraph.setMode(this.dataset.mode);
        });
    });

    const bfsModeBtns = document.querySelectorAll('#bfs .mode-btn');
    bfsModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            bfsModeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            bfsGraph.setMode(this.dataset.mode);
        });
    });
});

// DOM Elements
const visualizer = document.getElementById('visualizer');
const algorithmSelect = document.getElementById('algorithm');
const arraySizeInput = document.getElementById('arraySize');
const sortingSpeedInput = document.getElementById('sortingSpeed');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const comparisonsDisplay = document.getElementById('comparisons');
const swapsDisplay = document.getElementById('swaps');
const timeElapsedDisplay = document.getElementById('timeElapsed');
const algorithmInfoDisplay = document.getElementById('currentAlgorithmInfo');
const alertElement = document.getElementById('alert');
const alertMessage = document.getElementById('alertMessage');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('nav ul');
const darkModeToggle = document.getElementById('darkModeToggle');

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    generateRandomArray();
    updateAlgorithmInfo();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Algorithm selection change
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
    
    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
}

// Update array size display
function updateArraySizeValue() {
    document.getElementById('arraySizeValue').textContent = arraySizeInput.value;
    generateRandomArray();
}

// Update speed display
function updateSpeedValue() {
    document.getElementById('speedValue').textContent = sortingSpeedInput.value;
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        darkModeToggle.textContent = '🌙';
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Generate a random array based on the selected size
function generateRandomArray() {
    resetSorting();
    
    const size = parseInt(arraySizeInput.value);
    array = [];
    
    // Generate random values
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    
    // Render the array as bars
    renderBars();
}

// Render the array as visual bars
function renderBars() {
    visualizer.innerHTML = '';
    arrayBars = [];
    
    const maxValue = Math.max(...array);
    const containerHeight = visualizer.clientHeight - 40; // Accounting for padding
    const barWidth = (visualizer.clientWidth - (array.length * 4)) / array.length;
    
    for (let i = 0; i < array.length; i++) {
        const barHeight = (array[i] / maxValue) * containerHeight;
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = `${barWidth}px`;
        bar.style.height = `${barHeight}px`;
        
        const barValue = document.createElement('span');
        barValue.className = 'bar-value';
        barValue.textContent = array[i];
        bar.appendChild(barValue);
        
        visualizer.appendChild(bar);
        arrayBars.push(bar);
    }
}

// Update algorithm information when selection changes
function updateAlgorithmInfo() {
    const selectedAlgorithm = algorithmSelect.value;
    let infoText = '';
    
    switch (selectedAlgorithm) {
        case 'bubble':
            infoText = `<p><strong>Bubble Sort</strong> is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.</p>
                        <p><strong>Time Complexity:</strong> O(n²) in worst and average cases, O(n) in best case</p>
                        <p><strong>Space Complexity:</strong> O(1)</p>`;
            break;
        case 'selection':
            infoText = `<p><strong>Selection Sort</strong> is an in-place comparison sorting algorithm. It divides the input list into two parts: the sublist of items already sorted and the sublist of items remaining to be sorted. It repeatedly finds the minimum element from the unsorted sublist and moves it to the end of the sorted sublist.</p>
                        <p><strong>Time Complexity:</strong> O(n²) in all cases</p>
                        <p><strong>Space Complexity:</strong> O(1)</p>`;
            break;
        case 'insertion':
            infoText = `<p><strong>Insertion Sort</strong> builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort but can be efficient for small data sets.</p>
                        <p><strong>Time Complexity:</strong> O(n²) in worst and average cases, O(n) in best case</p>
                        <p><strong>Space Complexity:</strong> O(1)</p>`;
            break;
    }
    
    algorithmInfoDisplay.innerHTML = infoText;
}

// Reset sorting state
function resetSorting() {
    if (sorting) {
        clearInterval(sortingInterval);
        clearInterval(timer);
    }
    
    sorting = false;
    paused = false;
    comparisons = 0;
    swaps = 0;
    currentIndex = 0;
    currentCompareIndexes = [];
    sortedIndexes = [];
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start Sorting';
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
    comparisonsDisplay.textContent = '0';
    swapsDisplay.textContent = '0';
    timeElapsedDisplay.textContent = '0.00s';
    
    // Clear all bar classes
    if (arrayBars.length > 0) {
        arrayBars.forEach(bar => {
            bar.className = 'bar';
        });
    }
}

// Reset array to initial state
function resetArray() {
    resetSorting();
    renderBars();
}

// Start the sorting visualization
function startSorting() {
    if (sorting && paused) {
        // Resume sorting
        paused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        
        startTimer();
        startSortingProcess();
    } else if (!sorting) {
        // Start new sorting
        sorting = true;
        paused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        
        comparisons = 0;
        swaps = 0;
        currentIndex = 0;
        currentCompareIndexes = [];
        sortedIndexes = [];
        
        comparisonsDisplay.textContent = '0';
        swapsDisplay.textContent = '0';
        timeElapsedDisplay.textContent = '0.00s';
        
        startTime = new Date();
        startTimer();
        
        const selectedAlgorithm = algorithmSelect.value;
        switch (selectedAlgorithm) {
            case 'bubble':
                sortingAlgorithm = bubbleSort;
                break;
            case 'selection':
                sortingAlgorithm = selectionSort;
                break;
            case 'insertion':
                sortingAlgorithm = insertionSort;
                break;
        }
        
        startSortingProcess();
    }
}

// Start the timer
function startTimer() {
    if (timer) {
        clearInterval(timer);
    }
    
    timer = setInterval(() => {
        if (!paused) {
            const currentTime = new Date();
            const elapsedTime = (currentTime - startTime) / 1000;
            timeElapsedDisplay.textContent = elapsedTime.toFixed(2) + 's';
        }
    }, 10);
}

// Pause sorting visualization
function pauseSorting() {
    if (sorting && !paused) {
        paused = true;
        clearInterval(sortingInterval);
        clearInterval(timer);
        
        pauseBtn.disabled = true;
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    }
}

// Start the sorting process with the selected algorithm
function startSortingProcess() {
    // Clear any existing interval
    if (sortingInterval) {
        clearInterval(sortingInterval);
    }
    
    // Calculate delay based on speed input (inverse relationship)
    const speed = parseInt(sortingSpeedInput.value);
    const delay = Math.max(5, 505 - speed * 5); // 5ms to 500ms
    
    sortingInterval = setInterval(() => {
        if (!paused) {
            // Call the selected sorting algorithm function
            const done = sortingAlgorithm();
            
            if (done) {
                finishSorting();
            }
        }
    }, delay);
}

// Finish sorting animation
function finishSorting() {
    clearInterval(sortingInterval);
    clearInterval(timer);
    
    sorting = false;
    startBtn.disabled = true;
    pauseBtn.disabled = true;
    
    // Mark all bars as sorted
    arrayBars.forEach(bar => {
        bar.className = 'bar sorted';
    });
    
    // Show success message
    showAlert('Sorting completed successfully!', 'success');
    
    // Add animation to metrics
    document.querySelectorAll('.metric-value').forEach(metric => {
        metric.classList.add('pulse');
        setTimeout(() => {
            metric.classList.remove('pulse');
        }, 2000);
    });
}

// Show alert message
function showAlert(message, type = 'error') {
    alertMessage.textContent = message;
    alertElement.style.display = 'block';
    
    if (type === 'success') {
        alertElement.style.backgroundColor = '#d4edda';
        alertElement.style.color = '#155724';
        alertElement.style.borderLeft = '5px solid #c3e6cb';
    } else {
        alertElement.style.backgroundColor = '#f8d7da';
        alertElement.style.color = '#721c24';
        alertElement.style.borderLeft = '5px solid #f5c6cb';
    }
    
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000);
}

// Update the UI to reflect the current state of sorting
function updateUI() {
    // Reset all bars to default style
    arrayBars.forEach((bar, index) => {
        if (sortedIndexes.includes(index)) {
            bar.className = 'bar sorted';
        } else if (currentCompareIndexes.includes(index)) {
            bar.className = 'bar comparing';
        } else if (index === currentIndex) {
            bar.className = 'bar current';
        } else {
            bar.className = 'bar';
        }
    });
    
    // Update metrics
    comparisonsDisplay.textContent = comparisons;
    swapsDisplay.textContent = swaps;
}

// Swap two bars in the visualization
function swap(i, j) {
    // Swap values in array
    [array[i], array[j]] = [array[j], array[i]];
    
    // Update bar heights
    const tempHeight = arrayBars[i].style.height;
    arrayBars[i].style.height = arrayBars[j].style.height;
    arrayBars[j].style.height = tempHeight;
    
    // Update bar values
    const tempValue = arrayBars[i].querySelector('.bar-value').textContent;
    arrayBars[i].querySelector('.bar-value').textContent = arrayBars[j].querySelector('.bar-value').textContent;
    arrayBars[j].querySelector('.bar-value').textContent = tempValue;
    
    swaps++;
    swapsDisplay.textContent = swaps;
}

// ==============================================
// Sorting Algorithms Implementation
// ==============================================

// Bubble Sort implementation
function bubbleSort() {
    const n = array.length;

    // If entire array is sorted
    if (sortedIndexes.length >= n - 1) {
        return true;
    }

    // Reset compare indexes for this step
    currentCompareIndexes = [currentIndex, currentIndex + 1];

    // Compare and swap
    if (array[currentIndex] > array[currentIndex + 1]) {
        swap(currentIndex, currentIndex + 1);
    }

    comparisons++;

    currentIndex++;

    // End of one full pass
    if (currentIndex >= n - sortedIndexes.length - 1) {
        // Mark the last sorted position
        sortedIndexes.push(n - sortedIndexes.length - 1);

        // Start from beginning for next pass
        currentIndex = 0;
    }

    updateUI();
    return false;
}


// Selection Sort implementation
function selectionSort() {
    const n = array.length;

    if (sortedIndexes.length >= n) {
        return true;
    }

    const currentPos = sortedIndexes.length;

    if (currentIndex === currentPos) {
        minIndex = currentPos; // Track the minimum element index
        currentCompareIndexes = [currentPos];
    } else {
        currentCompareIndexes = [currentIndex, minIndex];

        if (array[currentIndex] < array[minIndex]) {
            minIndex = currentIndex;
        }

        comparisons++;
    }

    currentIndex++;

    if (currentIndex >= n) {
        if (minIndex !== currentPos) {
            swap(currentPos, minIndex);
        }

        sortedIndexes.push(currentPos);
        currentIndex = sortedIndexes.length;
        currentCompareIndexes = [];
    }

    updateUI();
    return false;
}


// Insertion Sort implementation
function insertionSort() {
    const n = array.length;
    
    // If we've gone through the entire array, we're done
    if (currentIndex >= n) {
        return true;
    }
    
    // If starting with a new key
    if (currentCompareIndexes.length === 0) {
        currentCompareIndexes = [currentIndex, currentIndex - 1];
        // All elements before currentIndex are already sorted
        for (let i = 0; i < currentIndex; i++) {
            if (!sortedIndexes.includes(i)) {
                sortedIndexes.push(i);
            }
        }
    }
    
    const key = currentCompareIndexes[0];
    const compareIndex = currentCompareIndexes[1];
    
    // If we can still compare with previous elements
    if (compareIndex >= 0 && array[compareIndex] > array[key]) {
        // Swap elements
        swap(compareIndex, key);
        
        // Move key position
        currentCompareIndexes = [compareIndex, compareIndex - 1];
        comparisons++;
    } else {
        // Mark the current element as sorted
        if (!sortedIndexes.includes(key)) {
            sortedIndexes.push(key);
        }
        
        // Move to next element
        currentIndex++;
        currentCompareIndexes = [];
    }
    
    updateUI();
    return false;
}
const processColors = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', 
    '#9b59b6', '#1abc9c', '#d35400', '#34495e',
    '#16a085', '#c0392b'
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    generateProcessInputs();
    document.getElementById('results').style.display = 'none';
});

// JavaScript for dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
    // Get the dark mode toggle button
    const darkModeToggle = document.getElementById('themeToggle'); // Make sure this ID matches your button
    
    // Check for saved user preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Set initial theme based on saved preference
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Add click event listener to button
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            // Toggle dark mode class on body
            document.body.classList.toggle('dark-mode');
            
            // Save user preference
            const isDarkModeNow = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkModeNow);
            
            // Update button text/icon if needed
            updateButtonAppearance(isDarkModeNow);
        });
    } else {
        console.error('Dark mode toggle button not found!');
    }
    
    // Update button appearance on load
    updateButtonAppearance(isDarkMode);
});

function updateButtonAppearance(isDarkMode) {
    const button = document.getElementById('darkModeToggle');
    if (button) {
        if (isDarkMode) {
            button.innerHTML = '☀️'; // Or whatever icon/text you want
        } else {
            button.innerHTML = '🌙';
        }
    }
}

// Adjust input fields based on selected algorithm
function adjustInputFields() {
    const algorithm = document.getElementById('algorithm').value;
    const timeQuantumGroup = document.getElementById('timeQuantumGroup');
    
    // Show/hide time quantum input for Round Robin
    timeQuantumGroup.style.display = algorithm === 'RR' ? 'block' : 'none';
    
    // Regenerate process inputs
    generateProcessInputs();
}

// Generate input fields for processes
function generateProcessInputs() {
    const processCount = parseInt(document.getElementById('processes').value);
    const algorithm = document.getElementById('algorithm').value;
    const container = document.getElementById('processInputs');
    
    // Clear previous inputs
    container.innerHTML = '';
    
    // Add header
    const header = document.createElement('div');
    header.className = 'process-row';
    
    header.innerHTML = `
        <div class="process-id">Process</div>
        <div class="process-input">
            <input type="text" disabled value="Arrival Time" style="background: #f8f9fa;">
            <input type="text" disabled value="Burst Time" style="background: #f8f9fa;">
            ${algorithm === 'Priority' ? '<input type="text" disabled value="Priority" style="background: #f8f9fa;">' : ''}
        </div>
    `;
    container.appendChild(header);
    
    // Add input fields for each process
    for (let i = 0; i < processCount; i++) {
        const row = document.createElement('div');
        row.className = 'process-row';
        
        row.innerHTML = `
            <div class="process-id">P${i+1}</div>
            <div class="process-input">
                <input type="number" id="arrivalTime_${i}" min="0" value="${i}" placeholder="Arrival Time">
                <input type="number" id="burstTime_${i}" min="1" value="${Math.floor(Math.random() * 10) + 1}" placeholder="Burst Time">
                ${algorithm === 'Priority' ? `<input type="number" id="priority_${i}" min="1" value="${Math.floor(Math.random() * 5) + 1}" placeholder="Priority">` : ''}
            </div>
        `;
        container.appendChild(row);
    }
}

// Main visualization function
function visualize() {
    // Get algorithm and process count
    const algorithm = document.getElementById('algorithm').value;
    const processCount = parseInt(document.getElementById('processes').value);
    
    // Collect process data
    const processes = [];
    for (let i = 0; i < processCount; i++) {
        const process = {
            id: i + 1,
            arrivalTime: parseInt(document.getElementById(`arrivalTime_${i}`).value),
            burstTime: parseInt(document.getElementById(`burstTime_${i}`).value),
            color: processColors[i % processColors.length],
            remainingTime: parseInt(document.getElementById(`burstTime_${i}`).value)
        };
        
        // Add priority if needed
        if (algorithm === 'Priority') {
            process.priority = parseInt(document.getElementById(`priority_${i}`).value);
        }
        
        processes.push(process);
    }
    
    // Get time quantum for Round Robin
    let timeQuantum = 0;
    if (algorithm === 'RR') {
        timeQuantum = parseInt(document.getElementById('timeQuantum').value);
        if (timeQuantum < 1) {
            alert('Time quantum must be at least 1');
            return;
        }
    }
    
    // Run scheduling algorithm
    let schedule;
    switch (algorithm) {
        case 'FCFS':
            schedule = runFCFS(processes);
            break;
        case 'SJF':
            schedule = runSJF(processes);
            break;
        case 'RR':
            schedule = runRR(processes, timeQuantum);
            break;
        case 'Priority':
            schedule = runPriority(processes);
            break;
    }
    
    // Display results
    displayResults(schedule, processes);
}

// FCFS Algorithm
function runFCFS(processes) {
    // Sort processes by arrival time
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    const schedule = [];
    let currentTime = 0;
    
    sortedProcesses.forEach(process => {
        // If there's a gap between processes, add idle time
        if (process.arrivalTime > currentTime) {
            schedule.push({
                id: 0, // 0 represents idle time
                start: currentTime,
                end: process.arrivalTime
            });
            currentTime = process.arrivalTime;
        }
        
        // Add the process to the schedule
        schedule.push({
            id: process.id,
            start: currentTime,
            end: currentTime + process.burstTime
        });
        
        currentTime += process.burstTime;
    });
    
    return schedule;
}

// SJF Algorithm (Non-preemptive)
function runSJF(processes) {
    const schedule = [];
    let currentTime = 0;
    let remainingProcesses = [...processes];
    
    // Continue until all processes are scheduled
    while (remainingProcesses.length > 0) {
        // Find available processes at current time
        const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
        
        // If no process is available, jump to the next arrival time
        if (availableProcesses.length === 0) {
            const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
            schedule.push({
                id: 0, // Idle time
                start: currentTime,
                end: nextArrival
            });
            currentTime = nextArrival;
            continue;
        }
        
        // Find the shortest job
        const shortestJob = availableProcesses.reduce(
            (shortest, current) => current.burstTime < shortest.burstTime ? current : shortest,
            availableProcesses[0]
        );
        
        // Add the job to schedule
        schedule.push({
            id: shortestJob.id,
            start: currentTime,
            end: currentTime + shortestJob.burstTime
        });
        
        currentTime += shortestJob.burstTime;
        
        // Remove the scheduled process
        remainingProcesses = remainingProcesses.filter(p => p.id !== shortestJob.id);
    }
    
    return schedule;
}

// Round Robin Algorithm
function runRR(processes, timeQuantum) {
    const schedule = [];
    let currentTime = 0;
    let remainingProcesses = [...processes].map(p => ({...p}));
    const readyQueue = [];
    
    // Sort processes by arrival time
    remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    while (remainingProcesses.length > 0 || readyQueue.length > 0) {
        // Add newly arrived processes to the ready queue
        while (remainingProcesses.length > 0 && remainingProcesses[0].arrivalTime <= currentTime) {
            readyQueue.push(remainingProcesses.shift());
        }
        
        // If ready queue is empty but there are still processes to arrive
        if (readyQueue.length === 0 && remainingProcesses.length > 0) {
            const nextArrival = remainingProcesses[0].arrivalTime;
            schedule.push({
                id: 0, // Idle time
                start: currentTime,
                end: nextArrival
            });
            currentTime = nextArrival;
            continue;
        }
        
        // Process the first process in ready queue
        if (readyQueue.length > 0) {
            const currentProcess = readyQueue.shift();
            const executeTime = Math.min(timeQuantum, currentProcess.remainingTime);
            
            schedule.push({
                id: currentProcess.id,
                start: currentTime,
                end: currentTime + executeTime
            });
            
            currentTime += executeTime;
            currentProcess.remainingTime -= executeTime;
            
            // Add newly arrived processes during this time slice
            while (remainingProcesses.length > 0 && remainingProcesses[0].arrivalTime <= currentTime) {
                readyQueue.push(remainingProcesses.shift());
            }
            
            // If process still has time remaining, add it back to the queue
            if (currentProcess.remainingTime > 0) {
                readyQueue.push(currentProcess);
            }
        }
    }
    
    return schedule;
}

// Priority Scheduling Algorithm (Non-preemptive)
function runPriority(processes) {
    const schedule = [];
    let currentTime = 0;
    let remainingProcesses = [...processes];
    
    // Continue until all processes are scheduled
    while (remainingProcesses.length > 0) {
        // Find available processes at current time
        const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
        
        // If no process is available, jump to the next arrival time
        if (availableProcesses.length === 0) {
            const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
            schedule.push({
                id: 0, // Idle time
                start: currentTime,
                end: nextArrival
            });
            currentTime = nextArrival;
            continue;
        }
        
        // Find the process with highest priority (lower number = higher priority)
        const highestPriorityProcess = availableProcesses.reduce(
            (highest, current) => current.priority < highest.priority ? current : highest,
            availableProcesses[0]
        );
        
        // Add the job to schedule
        schedule.push({
            id: highestPriorityProcess.id,
            start: currentTime,
            end: currentTime + highestPriorityProcess.burstTime
        });
        
        currentTime += highestPriorityProcess.burstTime;
        
        // Remove the scheduled process
        remainingProcesses = remainingProcesses.filter(p => p.id !== highestPriorityProcess.id);
    }
    
    return schedule;
}

// Display results
function displayResults(schedule, processes) {
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    // Calculate metrics
    const metrics = calculateMetrics(schedule, processes);
    
    // Display Gantt Chart
    displayGanttChart(schedule, processes);
    
    // Display metrics
    displayMetrics(metrics);
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Calculate waiting time, turnaround time, etc.
function calculateMetrics(schedule, processes) {
    const metrics = {};
    
    // Initialize metrics for each process
    processes.forEach(process => {
        metrics[process.id] = {
            id: process.id,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0
        };
    });
    
    // Calculate completion time for each process
    schedule.forEach(slot => {
        if (slot.id !== 0) { // Skip idle time
            metrics[slot.id].completionTime = Math.max(metrics[slot.id].completionTime, slot.end);
        }
    });
    
    // Calculate turnaround and waiting times
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    
    processes.forEach(process => {
        const m = metrics[process.id];
        m.turnaroundTime = m.completionTime - m.arrivalTime;
        m.waitingTime = m.turnaroundTime - m.burstTime;
        
        totalWaitingTime += m.waitingTime;
        totalTurnaroundTime += m.turnaroundTime;
    });
    
    // Calculate averages
    metrics.avgWaitingTime = totalWaitingTime / processes.length;
    metrics.avgTurnaroundTime = totalTurnaroundTime / processes.length;
    
    return metrics;
}

// Display Gantt Chart
function displayGanttChart(schedule, processes) {
    const ganttChart = document.getElementById('ganttChart');
    const ganttTimeline = document.getElementById('ganttTimeline');
    
    // Clear previous chart
    ganttChart.innerHTML = '';
    ganttTimeline.innerHTML = '';
    
    // Calculate total duration for proper scaling
    const totalDuration = schedule[schedule.length - 1].end;
    
    // Create gantt blocks
    schedule.forEach(slot => {
        const width = ((slot.end - slot.start) / totalDuration) * 100;
        
        const block = document.createElement('div');
        block.className = 'gantt-block';
        block.style.width = `${width}%`;
        
        if (slot.id === 0) {
            // Idle time
            block.style.backgroundColor = '#ddd';
            block.innerText = 'Idle';
        } else {
            // Process time
            const process = processes.find(p => p.id === slot.id);
            block.style.backgroundColor = process.color;
            block.innerText = `P${slot.id}`;
        }
        
        ganttChart.appendChild(block);
    });
    
    // Create timeline marks
    let marks = [];
    schedule.forEach(slot => {
        if (!marks.includes(slot.start)) marks.push(slot.start);
        if (!marks.includes(slot.end)) marks.push(slot.end);
    });
    
    marks.sort((a, b) => a - b);
    
    marks.forEach((time, index) => {
        const mark = document.createElement('div');
        mark.className = 'timeline-mark';
        
        // Calculate the position based on time (end of the block)
        const positionPercent = (time / totalDuration) * 100;
        mark.style.left = `${positionPercent}%`;
        
        // Set a consistent width for all marks
        mark.style.width = '20px';
        
        // Position the mark so its left edge aligns with the end of the block
        mark.style.marginLeft = '-18px';
        
        // Display the time value
        mark.innerText = time;
        
        ganttTimeline.appendChild(mark);
      });
}

// Display metrics table
function displayMetrics(metrics) {
    const processMetrics = document.getElementById('processMetrics');
    const averageMetrics = document.getElementById('averageMetrics');
    
    // Clear previous content
    processMetrics.innerHTML = '';
    averageMetrics.innerHTML = '';
    
    // Create table for process metrics
    const table = document.createElement('table');
    
    // Add header
    const header = document.createElement('tr');
    header.innerHTML = `
        <th>Process</th>
        <th>Arrival Time</th>
        <th>Burst Time</th>
        <th>Completion Time</th>
        <th>Turnaround Time</th>
        <th>Waiting Time</th>
    `;
    
    table.appendChild(header);
    
    // Add row for each process
    Object.values(metrics).forEach(process => {
        if (typeof process === 'object' && process.id) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>P${process.id}</td>
                <td>${process.arrivalTime}</td>
                <td>${process.burstTime}</td>
                <td>${process.completionTime}</td>
                <td>${process.turnaroundTime}</td>
                <td>${process.waitingTime}</td>
            `;
            table.appendChild(row);
        }
    });
    
    processMetrics.appendChild(table);
    
    // Display average metrics
    averageMetrics.innerHTML = `
        <p>Average Waiting Time: <strong>${metrics.avgWaitingTime.toFixed(2)}</strong></p>
        <p>Average Turnaround Time: <strong>${metrics.avgTurnaroundTime.toFixed(2)}</strong></p>
    `;
}