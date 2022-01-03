// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const addRemove = vscode.commands.registerCommand('linter-maintainer.addRemoveESLintRules', addRemoveRules);
	context.subscriptions.push(addRemove);

	const add = vscode.commands.registerCommand('linter-maintainer.addESLintRules', addRules);
	context.subscriptions.push(add);

	const remove = vscode.commands.registerCommand('linter-maintainer.removeESLintRules', removeRules);
	context.subscriptions.push(remove);
}

async function selectTargetPath() {
	const activeDocument = vscode.window.activeTextEditor?.document;
	if (!activeDocument) {
		vscode.window.showErrorMessage('No file is open');
		return;
	}
	const currentFileName = activeDocument.fileName;

	const fileDir = path.dirname(currentFileName);
	const workingFolder = vscode.workspace.getWorkspaceFolder(activeDocument.uri);

	const targetOptions = [fileDir];
	if (workingFolder && workingFolder.uri.fsPath !== fileDir) {
		targetOptions.push(workingFolder.uri.fsPath);
	}
	targetOptions.push('Define by yourself');

	let targetPath = await vscode.window.showQuickPick(targetOptions,
		{placeHolder: 'Select target folder path', canPickMany: false});

	if (targetPath && targetPath === 'Define by yourself') {
		targetPath = await vscode.window.showInputBox({placeHolder: 'Enter new path'});
	}

	return targetPath;
}

async function addRemoveRules() {
	const targetPath = await selectTargetPath();
	if (!targetPath) {
		return;
	}
	
	console.log(targetPath);
	addRules();
	removeRules();
}

async function addRules() {
	const targetPath = await selectTargetPath();
	if (!targetPath) {
		return;
	}
	const addedRulesNum = 5;
	vscode.window.showInformationMessage(`Added ${addedRulesNum} rules`);
}

async function removeRules() {
	const targetPath = await selectTargetPath();
	if (!targetPath) {
		return;
	}

	const removedRulesNum = 5;
	vscode.window.showInformationMessage(`Removed ${removedRulesNum} rules`);
}



// this method is called when your extension is deactivated
export function deactivate() {}
