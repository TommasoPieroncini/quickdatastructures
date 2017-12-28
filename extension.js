// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const utils = require('./utils.js');

let genTree = utils.genTree;
let genLL = utils.genLL;


/**
 * To differentiate variable names. Not in use currently.
 */
// function uuidv4() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// }

//let printedTree = ["# \n"];
// function printTree(root) {
//     printTreeHelp(root, 1);
// }
// function printTreeHelp(curr, line) {
//     if (curr === null) {
//         return;
//     }
//     if (printedTree.length <= line) {
//         printedTree = printedTree.concat(["# \n"]);
//         printedTree = printedTree.concat(["# \n"]);
//     }
//     printTreeHelp(curr.left, line + 2);
//     printTreeHelp(curr.right, line + 2);
// }

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let binSearchTree = vscode.commands.registerCommand('extension.genBinSearchTree', function () {
        vscode.window.showInputBox({value: "10", prompt: 'Enter number of nodes in the tree'}).then((numNodes) => {
            vscode.window.showInputBox({value: "0", prompt: 'Enter minimum data value (integer)'}).then((minimum) => {
                vscode.window.showInputBox({value: numNodes * 100, prompt: 'Enter maximum data value (integer)'}).then((maximum) => {
                    vscode.window.showInputBox({value: "n", prompt: 'Generate BinTree Node class? (y/n)'}).then((genClass) => {
                        outString = genTree(numNodes, minimum, maximum, genClass, true, vscode.window.activeTextEditor);
                    }, (error) => {
                        console.log(error);
                    });
                }, (error) => {
                    console.log(error);
                });
            }, (error) => {
                console.log(error);
            });
        }, (error) => {
            console.log(error);
        });
    });

    let binTree = vscode.commands.registerCommand('extension.genBinTree', function () {
        vscode.window.showInputBox({value: "10", prompt: 'Enter number of nodes in the tree'}).then((numNodes) => {
            vscode.window.showInputBox({value: "0", prompt: 'Enter minimum data value (integer)'}).then((minimum) => {
                vscode.window.showInputBox({value: numNodes * 100, prompt: 'Enter maximum data value (integer)'}).then((maximum) => {
                    vscode.window.showInputBox({value: "n", prompt: 'Generate BinTree Node class? (y/n)'}).then((genClass) => {
                        genTree(numNodes, minimum, maximum, genClass, false, vscode.window.activeTextEditor);
                    }, (error) => {
                        console.log(error);
                    });
                }, (error) => {
                    console.log(error);
                });
            }, (error) => {
                console.log(error);
            });
        }, (error) => {
            console.log(error);
        });
    });

    let linkedList = vscode.commands.registerCommand('extension.genLL', function () {
        vscode.window.showInputBox({value: "10", prompt: 'Enter number of nodes in the list'}).then((numNodes) => {
            vscode.window.showInputBox({value: "0", prompt: 'Enter minimum data value (integer)'}).then((minimum) => {
                vscode.window.showInputBox({value: numNodes * 100, prompt: 'Enter maximum data value (integer)'}).then((maximum) => {
                    vscode.window.showInputBox({value: "0", prompt: 'Enter number of nodes in a cycle (integer [0-N], N = total nodes in list)'}).then((cycleNodes) => {
                        if (Math.abs(cycleNodes) > Math.abs(numNodes)) {
                            console.log("Error - not enough nodes in LL");
                            return;
                        }
                        vscode.window.showInputBox({value: "n", prompt: 'Should the list be sorted? (y/n)'}).then((sorted) => {
                            vscode.window.showInputBox({value: "n", prompt: 'Generate LL Node class? (y/n)'}).then((genClass) => {
                                if (genClass === "y" || genClass === "yes") {
                                    genLL(numNodes, cycleNodes, minimum, maximum, sorted, true, vscode.window.activeTextEditor);
                                } else {
                                    genLL(numNodes, cycleNodes, minimum, maximum, sorted, false, vscode.window.activeTextEditor);
                                }
                            }, (error) => {
                                console.log(error);
                            });
                        }, (error) => {
                            console.log(error);
                        });
                    }, (error) => {
                        console.log(error);
                    });
                }, (error) => {
                    console.log(error);
                });
            }, (error) => {
                console.log(error);
            });
        }, (error) => {
            console.log(error);
        });
    });

    context.subscriptions.push(binSearchTree);
    context.subscriptions.push(binTree);
    context.subscriptions.push(linkedList);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}

exports.deactivate = deactivate;