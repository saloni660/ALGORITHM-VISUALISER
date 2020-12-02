// dijkstra algorithm

// importing functions
import {
	setWallAttribute
} from '../wall.js';
import {
	rowsize,
	colsize,
	weighttype
} from '../main.js';
// variables
var container = document.querySelector('.container');
var slider = document.getElementById("speed");
var time = slider.value;
// console.log(time);

// Check and update node
function checkNode(row, col, curr, checker, seen, counter) {
	if (row >= 0 && col >= 0 && row < rowsize && col < colsize) {
		var node = document.querySelector(`div[row="${row}"][col="${col}"]`);
		let wall = parseInt(node.getAttribute('wall'));
		if (wall == 1) return;
		let prow = parseInt(curr.getAttribute('row'));
		let pcol = parseInt(curr.getAttribute('col'));
		// console.log(wall);
		if (weighttype == "weighted") var cost = Math.min(
			parseInt(curr.getAttribute('cost')) +
			parseInt(node.getAttribute('weight')),
			node.getAttribute('cost')
		);
		else var cost = Math.min(
			parseInt(curr.getAttribute('cost')) +
			Math.abs(Math.abs(prow - row) + Math.abs(pcol - col)),
			node.getAttribute('cost')
		);
		if (cost < node.getAttribute('cost')) {
			node.setAttribute(
				'parent',
				curr.getAttribute('row') + '|' + curr.getAttribute('col')
			);
			node.setAttribute('cost', cost);
		}

		// changeColor(node, counter, cost);
		changeColor(curr, counter, curr.getAttribute('cost'));
		if (!seen.includes(node)) {
			checker.push(node);
		}
		seen.push(node);
		return node;
	} else {
		return false;
	}
} // End checkNode

// Animate the nodes
function changeColor(node, counter, cost) {
	setTimeout(() => {
		node.setAttribute('class', 'Path_green');
		if (cost) {
			node.innerHTML = cost;
		}
	}, counter * time);
	setTimeout(() => {
		node.setAttribute('class', 'Path_red');
	}, counter * time + 100);
} // End changeColor

export function dfs(x1 = 0, y1 = 0, x2 = rowsize - 1, y2 = colsize - 1) {
	time = slider.value;
	time = 40 + (time - 1) * (-2);
	container.removeEventListener('mousedown', setWallAttribute);
	container.removeEventListener('mouseover', setWallAttribute);
	var startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);
	var endNode = document.querySelector(`div[row='${x2}'][col='${y2}']`);
	// Hide button
	var btn = document.querySelector('.start');
	var refreshBtn = document.querySelector('.refresh');
	btn.style.visibility = 'hidden';
	refreshBtn.style.visibility = 'hidden';

	/* ################################### Algo here ############################3*/

	var seen = [startNode];
	// Checker Array implemented as Queue
	var checker = [startNode];
	var counter = 1;
	while (checker.length != 0) {
		if (counter==100) { console.log(checker); break; }
		let curr = checker.pop();
		// Important to parse string to integer
		let row = parseInt(curr.getAttribute('row'));
		let col = parseInt(curr.getAttribute('col'));
		let wall = parseInt(curr.getAttribute('wall'));
		if (wall == 1) continue;

		// Check up down left right
		let right = row + 1;
		let left = row - 1;
		let down = col - 1;
		let up = col + 1;
		let d = checkNode(row, up, curr, checker, seen, counter);
		let a = checkNode(right, col, curr, checker, seen, counter);
		let c = checkNode(row, down, curr, checker, seen, counter);
		let b = checkNode(left, col, curr, checker, seen, counter);
		counter++;
	}

	// Draw out best route
	setTimeout(() => {
		startNode.setAttribute('class', 'ends')
		while (endNode.getAttribute('parent') != 'null') {
			endNode.setAttribute('class', 'Path_green')
			var coor = endNode.getAttribute('parent').split('|');
			var prow = parseInt(coor[0]);
			var pcol = parseInt(coor[1]);
			endNode = document.querySelector(`div[row="${prow}"][col="${pcol}"]`);
		}
		endNode = document.querySelector(`div[row="${x2}"][col="${y2}"]`);
		endNode.setAttribute('class', 'ends');
	}, counter * time + 100);
	// Show refresh button again
	setTimeout(() => {
		refreshBtn.style.visibility = 'visible';
	}, counter * time + 100);
} // End start