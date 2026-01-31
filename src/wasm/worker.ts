/// <reference lib="webworker" />
import './wasm_exec.js';

declare const self: DedicatedWorkerGlobalScope;

let go: any;
let wasmReady = false;
let opfsRootHandle: FileSystemDirectoryHandle | null = null;

async function initWasm() {
  if (wasmReady) return;
  // create a opfs handle
  await initOPFS();

  // init Go glue
  go = new (self as any).Go();

  // load and run Wasm
  const response = await fetch('./core.wasm');
  const buffer = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(buffer, go.importObject);

  // start Go (non-blocking)
  go.run(instance);
  wasmReady = true;
}

async function initOPFS() {
  if (!navigator.storage || typeof navigator.storage.getDirectory !== 'function') {
    throw new Error('OPFS not available. navigator.storage: ' + navigator.storage);
  }

  opfsRootHandle = await navigator.storage.getDirectory();
  // expose for Go
  (self as any).opfsRootHandle = opfsRootHandle;
}

self.onmessage = async (e: MessageEvent) => {
  const { id, method, args } = e.data;
  try {
    // init if not already
    await initWasm();

    // convert args to JSON strings if they are objects
    const jsonArgs = args.map((a: any) => (typeof a === 'object' ? JSON.stringify(a) : a));

    // call the Go WASM method
    let rawResult = await (self as any).CalendarCore[method](...jsonArgs);

    // unmarshall
    let processedResult = typeof rawResult === 'string' && rawResult !== '' ? JSON.parse(rawResult) : rawResult;

    self.postMessage({ id, result: processedResult ?? null });
  } catch (err: any) {
    self.postMessage({ id, error: err.message });
  }
};
