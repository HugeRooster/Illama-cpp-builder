const SCHEMA_SOURCE_NOTE = [
  "Flag metadata in this file is seeded from verified llama.cpp definitions and extended against the local help output captured from E:\\llama-vulkan-x64.",
  "The current local reference dumps are llama-cli-help.txt and llama-server-help.txt in this workspace.",
  "To add more flags safely, copy exact names, aliases, and value types from current --help output or common/arg.cpp into FLAG_SCHEMA.",
].join(" ");

const STATIC_FIELDS = [
  {
    key: "executablePath",
    label: "Executable path",
    type: "path-picker",
    required: true,
    placeholder: "C:\\llama.cpp\\build\\bin\\Release\\llama-server.exe",
    helpText: "Path to the llama.cpp executable you want to run, such as llama-cli.exe or llama-server.exe.",
    accepts: ".exe",
    kindLabel: "Executable",
  },
  {
    key: "modelPath",
    label: "Model path",
    type: "path-picker",
    required: true,
    placeholder: "C:\\models\\model.gguf",
    helpText: "Maps to --model. Use the picker for convenience, then replace with the full Windows path if needed.",
    accepts: ".gguf,.bin",
    primaryArg: "--model",
    kindLabel: "Model",
  },
  {
    key: "draftModelPath",
    label: "Draft model path",
    type: "path-picker",
    required: false,
    placeholder: "C:\\models\\draft.gguf",
    helpText: "Maps to --spec-draft-model for speculative decoding.",
    accepts: ".gguf,.bin",
    primaryArg: "--spec-draft-model",
    kindLabel: "Draft model",
  },
];

const CATEGORY_ORDER = [
  "modelSources",
  "coreRuntime",
  "sampling",
  "speculative",
  "server",
  "logging",
];

const CATEGORY_META = {
  modelSources: {
    title: "Model sources and prompt inputs",
    description: "Verified source and prompt-related arguments from common/arg.cpp.",
  },
  coreRuntime: {
    title: "Core runtime and performance",
    description: "Context, batching, CPU, GPU, memory, and runtime behavior.",
  },
  sampling: {
    title: "Sampling",
    description: "Token selection and output constraints.",
  },
  speculative: {
    title: "Speculative decoding",
    description: "Draft-model and ngram speculative decoding options.",
  },
  server: {
    title: "Server",
    description: "Server-specific networking and API options.",
  },
  logging: {
    title: "Logging and diagnostics",
    description: "Logging, verbosity, and output control.",
  },
};

const PRESET_STORAGE_KEY = "llama.cpp.command.builder.presets.v1";

const EXECUTABLE_MODE = {
  AUTO: "auto",
  CLI: "cli",
  SERVER: "server",
};

const CLI_ONLY_KEYS = new Set([
  "prompt",
  "systemPrompt",
  "promptFile",
  "binaryFile",
  "systemPromptFile",
  "displayPrompt",
  "conversation",
  "simpleIo",
  "special",
  "color",
  "showTimings",
]);

const FLAG_SCHEMA = [
  {
    key: "hfRepo",
    label: "Hugging Face repo",
    category: "modelSources",
    type: "text",
    primaryArg: "--hf-repo",
    aliases: ["-hf", "-hfr"],
    placeholder: "ggml-org/Model-GGUF:Q4_K_M",
    helpText: "Verified from common/arg.cpp. Same meaning as llama.cpp --hf-repo.",
  },
  {
    key: "hfFile",
    label: "Hugging Face file",
    category: "modelSources",
    type: "text",
    primaryArg: "--hf-file",
    aliases: ["-hff"],
    placeholder: "model-q4_k_m.gguf",
    helpText: "Overrides the quant selected by --hf-repo.",
  },
  {
    key: "modelUrl",
    label: "Model URL",
    category: "modelSources",
    type: "text",
    primaryArg: "--model-url",
    aliases: ["-mu"],
    placeholder: "https://example.com/model.gguf",
    helpText: "Remote model download URL.",
  },
  {
    key: "dockerRepo",
    label: "Docker repo",
    category: "modelSources",
    type: "text",
    primaryArg: "--docker-repo",
    aliases: ["-dr"],
    placeholder: "ai/model:latest",
    helpText: "Docker Hub model repository source.",
  },
  {
    key: "prompt",
    label: "Prompt",
    category: "modelSources",
    type: "textarea",
    primaryArg: "--prompt",
    aliases: ["-p"],
    helpText: "Prompt to start generation with.",
  },
  {
    key: "systemPrompt",
    label: "System prompt",
    category: "modelSources",
    type: "textarea",
    primaryArg: "--system-prompt",
    aliases: ["-sys"],
    helpText: "System prompt to use with the model.",
  },
  {
    key: "promptFile",
    label: "Prompt file",
    category: "modelSources",
    type: "text",
    primaryArg: "--file",
    aliases: ["-f"],
    placeholder: "C:\\prompts\\input.txt",
    helpText: "Load the prompt from a text file.",
  },
  {
    key: "binaryFile",
    label: "Binary prompt file",
    category: "modelSources",
    type: "text",
    primaryArg: "--binary-file",
    aliases: ["-bf"],
    placeholder: "C:\\prompts\\input.bin",
    helpText: "Load the prompt from a binary file.",
  },
  {
    key: "systemPromptFile",
    label: "System prompt file",
    category: "modelSources",
    type: "text",
    primaryArg: "--system-prompt-file",
    aliases: ["-sysf"],
    placeholder: "C:\\prompts\\system.txt",
    helpText: "Load the system prompt from a text file.",
  },
  {
    key: "chatTemplate",
    label: "Chat template",
    category: "modelSources",
    type: "textarea",
    primaryArg: "--chat-template",
    helpText: "Set a custom Jinja chat template string.",
  },
  {
    key: "chatTemplateFile",
    label: "Chat template file",
    category: "modelSources",
    type: "text",
    primaryArg: "--chat-template-file",
    placeholder: "C:\\templates\\chat.jinja",
    helpText: "Load a custom Jinja chat template file.",
  },
  {
    key: "displayPrompt",
    label: "Display prompt",
    category: "modelSources",
    type: "select",
    positiveArg: "--display-prompt",
    negativeArg: "--no-display-prompt",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Show" },
      { value: "off", label: "Hide" },
    ],
    helpText: "Whether to print prompt text at generation time.",
  },
  {
    key: "threads",
    label: "Threads",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--threads",
    aliases: ["-t"],
    placeholder: "8",
    helpText: "Number of CPU threads to use during generation.",
  },
  {
    key: "threadsBatch",
    label: "Threads batch",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--threads-batch",
    aliases: ["-tb"],
    placeholder: "8",
    helpText: "Threads used during batch and prompt processing.",
  },
  {
    key: "cpuMask",
    label: "CPU mask",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--cpu-mask",
    aliases: ["-C"],
    placeholder: "ff",
    helpText: "CPU affinity mask. Complements --cpu-range.",
  },
  {
    key: "cpuRange",
    label: "CPU range",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--cpu-range",
    aliases: ["-Cr"],
    placeholder: "0-15",
    helpText: "CPU affinity range. Complements --cpu-mask.",
  },
  {
    key: "cpuStrict",
    label: "CPU strict",
    category: "coreRuntime",
    type: "select",
    primaryArg: "--cpu-strict",
    options: [
      { value: "", label: "Default" },
      { value: "0", label: "0" },
      { value: "1", label: "1" },
    ],
    helpText: "Use strict CPU placement.",
  },
  {
    key: "prio",
    label: "Priority",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--prio",
    placeholder: "0",
    helpText: "Process or thread priority.",
  },
  {
    key: "poll",
    label: "Polling level",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--poll",
    placeholder: "50",
    helpText: "Polling level used to wait for work.",
  },
  {
    key: "cpuMaskBatch",
    label: "CPU mask batch",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--cpu-mask-batch",
    aliases: ["-Cb"],
    placeholder: "ff",
    helpText: "Batch CPU affinity mask.",
  },
  {
    key: "cpuRangeBatch",
    label: "CPU range batch",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--cpu-range-batch",
    aliases: ["-Crb"],
    placeholder: "0-15",
    helpText: "Batch CPU affinity range.",
  },
  {
    key: "cpuStrictBatch",
    label: "CPU strict batch",
    category: "coreRuntime",
    type: "select",
    primaryArg: "--cpu-strict-batch",
    options: [
      { value: "", label: "Default" },
      { value: "0", label: "0" },
      { value: "1", label: "1" },
    ],
    helpText: "Use strict CPU placement for batch processing.",
  },
  {
    key: "prioBatch",
    label: "Priority batch",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--prio-batch",
    placeholder: "0",
    helpText: "Batch processing priority.",
  },
  {
    key: "pollBatch",
    label: "Poll batch",
    category: "coreRuntime",
    type: "select",
    primaryArg: "--poll-batch",
    options: [
      { value: "", label: "Default" },
      { value: "0", label: "0" },
      { value: "1", label: "1" },
    ],
    helpText: "Polling behavior for batch work.",
  },
  {
    key: "ctxSize",
    label: "Context size",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--ctx-size",
    aliases: ["-c"],
    placeholder: "4096",
    helpText: "Prompt context size. 0 means load from model.",
  },
  {
    key: "nPredict",
    label: "Tokens to predict",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--n-predict",
    aliases: ["-n", "--predict"],
    placeholder: "256",
    helpText: "Number of tokens to predict.",
  },
  {
    key: "batchSize",
    label: "Batch size",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--batch-size",
    aliases: ["-b"],
    placeholder: "2048",
    helpText: "Logical maximum batch size.",
  },
  {
    key: "ubatchSize",
    label: "Ubatch size",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--ubatch-size",
    aliases: ["-ub"],
    placeholder: "512",
    helpText: "Physical maximum batch size.",
  },
  {
    key: "parallel",
    label: "Parallel",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--parallel",
    aliases: ["-np"],
    placeholder: "1",
    helpText: "Number of parallel sequences to decode or server slots for llama-server.",
  },
  {
    key: "flashAttn",
    label: "Flash attention",
    category: "coreRuntime",
    type: "select",
    primaryArg: "--flash-attn",
    aliases: ["-fa"],
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "On" },
      { value: "off", label: "Off" },
      { value: "auto", label: "Auto" },
    ],
    helpText: "Set Flash Attention use.",
  },
  {
    key: "color",
    label: "Color",
    category: "coreRuntime",
    type: "select",
    primaryArg: "--color",
    aliases: ["-co"],
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "On" },
      { value: "off", label: "Off" },
      { value: "auto", label: "Auto" },
    ],
    helpText: "Colorize output for prompt and generations.",
  },
  {
    key: "conversation",
    label: "Conversation mode",
    category: "coreRuntime",
    type: "select",
    positiveArg: "--conversation",
    negativeArg: "--no-conversation",
    aliases: ["-cnv", "-no-cnv"],
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Conversation mode with interactive chat behavior.",
  },
  {
    key: "escape",
    label: "Process escape sequences",
    category: "coreRuntime",
    type: "select",
    positiveArg: "--escape",
    negativeArg: "--no-escape",
    aliases: ["-e"],
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Process escape sequences in prompt-like inputs.",
  },
  {
    key: "ropeScaling",
    label: "RoPE scaling",
    category: "coreRuntime",
    type: "select",
    primaryArg: "--rope-scaling",
    options: [
      { value: "", label: "Default" },
      { value: "none", label: "none" },
      { value: "linear", label: "linear" },
      { value: "yarn", label: "yarn" },
    ],
    helpText: "RoPE frequency scaling method.",
  },
  {
    key: "ropeScale",
    label: "RoPE scale",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--rope-scale",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "1.0",
    helpText: "RoPE context scaling factor.",
  },
  {
    key: "ropeFreqBase",
    label: "RoPE freq base",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--rope-freq-base",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0",
    helpText: "RoPE base frequency.",
  },
  {
    key: "ropeFreqScale",
    label: "RoPE freq scale",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--rope-freq-scale",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "1.0",
    helpText: "RoPE frequency scaling factor.",
  },
  {
    key: "yarnOrigCtx",
    label: "YaRN original context",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--yarn-orig-ctx",
    placeholder: "0",
    helpText: "Original model context size used by YaRN.",
  },
  {
    key: "yarnExtFactor",
    label: "YaRN ext factor",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--yarn-ext-factor",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.0",
    helpText: "YaRN extrapolation mix factor.",
  },
  {
    key: "yarnAttnFactor",
    label: "YaRN attention factor",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--yarn-attn-factor",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.0",
    helpText: "YaRN attention factor.",
  },
  {
    key: "yarnBetaSlow",
    label: "YaRN beta slow",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--yarn-beta-slow",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.0",
    helpText: "YaRN beta slow parameter.",
  },
  {
    key: "yarnBetaFast",
    label: "YaRN beta fast",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--yarn-beta-fast",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.0",
    helpText: "YaRN beta fast parameter.",
  },
  {
    key: "warmup",
    label: "Warmup",
    category: "coreRuntime",
    type: "select",
    positiveArg: "--warmup",
    negativeArg: "--no-warmup",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Perform warmup with an empty run.",
  },
  {
    key: "showTimings",
    label: "Show timings",
    category: "coreRuntime",
    type: "select",
    positiveArg: "--show-timings",
    negativeArg: "--no-show-timings",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Show" },
      { value: "off", label: "Hide" },
    ],
    helpText: "Show timing information after each response.",
  },
  {
    key: "contextShift",
    label: "Context shift",
    category: "coreRuntime",
    type: "select",
    positiveArg: "--context-shift",
    negativeArg: "--no-context-shift",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Use context shift on infinite generation.",
  },
  {
    key: "simpleIo",
    label: "Simple IO",
    category: "coreRuntime",
    type: "checkbox",
    primaryArg: "--simple-io",
    helpText: "Use basic IO for better subprocess and limited-console compatibility.",
  },
  {
    key: "special",
    label: "Special tokens output",
    category: "coreRuntime",
    type: "checkbox",
    primaryArg: "--special",
    aliases: ["-sp"],
    helpText: "Enable special token output.",
  },
  {
    key: "mmap",
    label: "Memory-map model",
    category: "coreRuntime",
    type: "select",
    positiveArg: "--mmap",
    negativeArg: "--no-mmap",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Use memory-mapped model loading.",
  },
  {
    key: "mlock",
    label: "Mlock",
    category: "coreRuntime",
    type: "checkbox",
    primaryArg: "--mlock",
    helpText: "Keep the model in RAM instead of swapping or compressing.",
  },
  {
    key: "directIo",
    label: "Direct IO",
    category: "coreRuntime",
    type: "select",
    positiveArg: "--direct-io",
    negativeArg: "--no-direct-io",
    aliases: ["-dio", "-ndio"],
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Use Direct IO if available.",
  },
  {
    key: "numa",
    label: "NUMA strategy",
    category: "coreRuntime",
    type: "select",
    primaryArg: "--numa",
    options: [
      { value: "", label: "Default" },
      { value: "distribute", label: "distribute" },
      { value: "isolate", label: "isolate" },
      { value: "numactl", label: "numactl" },
    ],
    helpText: "NUMA optimization mode.",
  },
  {
    key: "device",
    label: "Device list",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--device",
    aliases: ["-dev"],
    placeholder: "CUDA0,CUDA1 or none",
    helpText: "Comma-separated list of devices for offloading.",
  },
  {
    key: "rpcServers",
    label: "RPC servers",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--rpc",
    placeholder: "host1:50052,host2:50052",
    helpText: "Comma-separated RPC servers.",
  },
  {
    key: "gpuLayers",
    label: "GPU layers",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--gpu-layers",
    aliases: ["-ngl", "--n-gpu-layers"],
    placeholder: "auto, all, or 99",
    helpText: "Number of layers to store in VRAM, or auto/all.",
  },
  {
    key: "splitMode",
    label: "Split mode",
    category: "coreRuntime",
    type: "select",
    primaryArg: "--split-mode",
    aliases: ["-sm"],
    options: [
      { value: "", label: "Default" },
      { value: "none", label: "none" },
      { value: "layer", label: "layer" },
      { value: "row", label: "row" },
      { value: "tensor", label: "tensor" },
    ],
    helpText: "How to split the model across multiple GPUs.",
  },
  {
    key: "tensorSplit",
    label: "Tensor split",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--tensor-split",
    aliases: ["-ts"],
    placeholder: "3,1",
    helpText: "Comma-separated offload proportions per GPU.",
  },
  {
    key: "mainGpu",
    label: "Main GPU",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--main-gpu",
    aliases: ["-mg"],
    placeholder: "0",
    helpText: "Main GPU index.",
  },
  {
    key: "fit",
    label: "Fit arguments to memory",
    category: "coreRuntime",
    type: "select",
    primaryArg: "--fit",
    aliases: ["-fit"],
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "On" },
      { value: "off", label: "Off" },
    ],
    helpText: "Adjust unset arguments to fit device memory.",
  },
  {
    key: "fitTarget",
    label: "Fit target",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--fit-target",
    aliases: ["-fitt"],
    placeholder: "1024 or 1024,2048",
    helpText: "Target memory margin per device in MiB.",
  },
  {
    key: "fitCtx",
    label: "Fit minimum context",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--fit-ctx",
    aliases: ["-fitc"],
    placeholder: "4096",
    helpText: "Minimum context size allowed by --fit.",
  },
  {
    key: "kvOffload",
    label: "KV offload",
    category: "coreRuntime",
    type: "select",
    positiveArg: "--kv-offload",
    negativeArg: "--no-kv-offload",
    aliases: ["-kvo", "-nkvo"],
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Enable KV cache offloading.",
  },
  {
    key: "cacheTypeK",
    label: "Cache type K",
    category: "coreRuntime",
    type: "select",
    primaryArg: "--cache-type-k",
    aliases: ["-ctk"],
    options: [
      { value: "", label: "Default" },
      { value: "f32", label: "f32" },
      { value: "f16", label: "f16" },
      { value: "bf16", label: "bf16" },
      { value: "q8_0", label: "q8_0" },
      { value: "q4_0", label: "q4_0" },
      { value: "q4_1", label: "q4_1" },
      { value: "iq4_nl", label: "iq4_nl" },
      { value: "q5_0", label: "q5_0" },
      { value: "q5_1", label: "q5_1" },
    ],
    helpText: "KV cache data type for K.",
  },
  {
    key: "cacheTypeV",
    label: "Cache type V",
    category: "coreRuntime",
    type: "select",
    primaryArg: "--cache-type-v",
    aliases: ["-ctv"],
    options: [
      { value: "", label: "Default" },
      { value: "f32", label: "f32" },
      { value: "f16", label: "f16" },
      { value: "bf16", label: "bf16" },
      { value: "q8_0", label: "q8_0" },
      { value: "q4_0", label: "q4_0" },
      { value: "q4_1", label: "q4_1" },
      { value: "iq4_nl", label: "iq4_nl" },
      { value: "q5_0", label: "q5_0" },
      { value: "q5_1", label: "q5_1" },
    ],
    helpText: "KV cache data type for V.",
  },
  {
    key: "overrideTensor",
    label: "Override tensor buffer type",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--override-tensor",
    aliases: ["-ot"],
    placeholder: "blk\\.0=CPU",
    helpText: "Override tensor buffer types by tensor name pattern.",
  },
  {
    key: "cpuMoe",
    label: "CPU MoE",
    category: "coreRuntime",
    type: "checkbox",
    primaryArg: "--cpu-moe",
    aliases: ["-cmoe"],
    helpText: "Keep all Mixture of Experts weights on CPU.",
  },
  {
    key: "nCpuMoe",
    label: "N CPU MoE layers",
    category: "coreRuntime",
    type: "number",
    primaryArg: "--n-cpu-moe",
    aliases: ["-ncmoe"],
    placeholder: "0",
    helpText: "Keep the first N MoE layers on CPU.",
  },
  {
    key: "checkTensors",
    label: "Check tensors",
    category: "coreRuntime",
    type: "checkbox",
    primaryArg: "--check-tensors",
    helpText: "Check model tensor data for invalid values.",
  },
  {
    key: "overrideKv",
    label: "Override KV metadata",
    category: "coreRuntime",
    type: "textarea",
    primaryArg: "--override-kv",
    placeholder: "tokenizer.ggml.add_bos_token=bool:false",
    helpText: "Override model metadata by key with typed values.",
  },
  {
    key: "opOffload",
    label: "Host op offload",
    category: "coreRuntime",
    type: "select",
    positiveArg: "--op-offload",
    negativeArg: "--no-op-offload",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Offload host tensor operations to device.",
  },
  {
    key: "lora",
    label: "LoRA adapter",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--lora",
    placeholder: "C:\\lora\\adapter.gguf",
    helpText: "Comma-separated LoRA adapter paths.",
  },
  {
    key: "loraScaled",
    label: "LoRA scaled",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--lora-scaled",
    placeholder: "C:\\lora\\adapter.gguf:0.8",
    helpText: "Comma-separated LoRA adapter paths with SCALE.",
  },
  {
    key: "controlVector",
    label: "Control vector",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--control-vector",
    placeholder: "C:\\vectors\\style.gguf",
    helpText: "Comma-separated control vector paths.",
  },
  {
    key: "controlVectorScaled",
    label: "Control vector scaled",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--control-vector-scaled",
    placeholder: "C:\\vectors\\style.gguf:0.5",
    helpText: "Comma-separated control vector paths with SCALE.",
  },
  {
    key: "controlVectorLayerRange",
    label: "Control vector layer range",
    category: "coreRuntime",
    type: "text",
    primaryArg: "--control-vector-layer-range",
    placeholder: "0 20",
    helpText: "Two values: START END. You can enter them separated by a space or comma.",
    valueCount: 2,
  },
  {
    key: "seed",
    label: "Seed",
    category: "sampling",
    type: "number",
    primaryArg: "--seed",
    aliases: ["-s"],
    placeholder: "42",
    helpText: "RNG seed.",
  },
  {
    key: "samplers",
    label: "Samplers",
    category: "sampling",
    type: "text",
    primaryArg: "--samplers",
    placeholder: "top_k;top_p;min_p;temperature",
    helpText: "Semicolon-separated sampler list in llama.cpp order.",
  },
  {
    key: "samplerSeq",
    label: "Sampler sequence",
    category: "sampling",
    type: "text",
    primaryArg: "--sampler-seq",
    aliases: ["--sampling-seq"],
    placeholder: "edskypmxt",
    helpText: "Simplified sampler sequence shorthand.",
  },
  {
    key: "ignoreEos",
    label: "Ignore EOS",
    category: "sampling",
    type: "checkbox",
    primaryArg: "--ignore-eos",
    helpText: "Ignore EOS and continue generating.",
  },
  {
    key: "temperature",
    label: "Temperature",
    category: "sampling",
    type: "number",
    primaryArg: "--temperature",
    aliases: ["--temp"],
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.8",
    helpText: "Sampling temperature.",
  },
  {
    key: "topK",
    label: "Top-k",
    category: "sampling",
    type: "number",
    primaryArg: "--top-k",
    placeholder: "40",
    helpText: "Top-k sampling cutoff.",
  },
  {
    key: "topP",
    label: "Top-p",
    category: "sampling",
    type: "number",
    primaryArg: "--top-p",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.95",
    helpText: "Nucleus sampling parameter.",
  },
  {
    key: "minP",
    label: "Min-p",
    category: "sampling",
    type: "number",
    primaryArg: "--min-p",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.05",
    helpText: "Min-p sampling parameter.",
  },
  {
    key: "topNSigma",
    label: "Top-n sigma",
    category: "sampling",
    type: "number",
    primaryArg: "--top-n-sigma",
    aliases: ["--top-nsigma"],
    inputMode: "decimal",
    step: "0.01",
    placeholder: "-1",
    helpText: "Top-n-sigma sampling parameter.",
  },
  {
    key: "xtcProbability",
    label: "XTC probability",
    category: "sampling",
    type: "number",
    primaryArg: "--xtc-probability",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.0",
    helpText: "XTC probability parameter.",
  },
  {
    key: "xtcThreshold",
    label: "XTC threshold",
    category: "sampling",
    type: "number",
    primaryArg: "--xtc-threshold",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.1",
    helpText: "XTC threshold parameter.",
  },
  {
    key: "typicalP",
    label: "Typical-p",
    category: "sampling",
    type: "number",
    primaryArg: "--typical-p",
    aliases: ["--typical"],
    inputMode: "decimal",
    step: "0.01",
    placeholder: "1.0",
    helpText: "Locally typical sampling parameter.",
  },
  {
    key: "repeatLastN",
    label: "Repeat last n",
    category: "sampling",
    type: "number",
    primaryArg: "--repeat-last-n",
    placeholder: "64",
    helpText: "Last N tokens considered for repeat penalty.",
  },
  {
    key: "repeatPenalty",
    label: "Repeat penalty",
    category: "sampling",
    type: "number",
    primaryArg: "--repeat-penalty",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "1.1",
    helpText: "Penalty for repeated token sequences.",
  },
  {
    key: "presencePenalty",
    label: "Presence penalty",
    category: "sampling",
    type: "number",
    primaryArg: "--presence-penalty",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.0",
    helpText: "Presence penalty.",
  },
  {
    key: "frequencyPenalty",
    label: "Frequency penalty",
    category: "sampling",
    type: "number",
    primaryArg: "--frequency-penalty",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.0",
    helpText: "Frequency penalty.",
  },
  {
    key: "dryMultiplier",
    label: "DRY multiplier",
    category: "sampling",
    type: "number",
    primaryArg: "--dry-multiplier",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.0",
    helpText: "DRY sampling multiplier.",
  },
  {
    key: "dryBase",
    label: "DRY base",
    category: "sampling",
    type: "number",
    primaryArg: "--dry-base",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "1.75",
    helpText: "DRY sampling base value.",
  },
  {
    key: "dryAllowedLength",
    label: "DRY allowed length",
    category: "sampling",
    type: "number",
    primaryArg: "--dry-allowed-length",
    placeholder: "2",
    helpText: "Allowed length for DRY sampling.",
  },
  {
    key: "dryPenaltyLastN",
    label: "DRY penalty last n",
    category: "sampling",
    type: "number",
    primaryArg: "--dry-penalty-last-n",
    placeholder: "-1",
    helpText: "Last N tokens considered for the DRY penalty.",
  },
  {
    key: "drySequenceBreaker",
    label: "DRY sequence breaker",
    category: "sampling",
    type: "text",
    primaryArg: "--dry-sequence-breaker",
    placeholder: "none or \\n",
    helpText: "Sequence breaker value for DRY sampling.",
  },
  {
    key: "mirostat",
    label: "Mirostat",
    category: "sampling",
    type: "select",
    primaryArg: "--mirostat",
    options: [
      { value: "", label: "Default" },
      { value: "0", label: "0 disabled" },
      { value: "1", label: "1 Mirostat" },
      { value: "2", label: "2 Mirostat 2.0" },
    ],
    helpText: "Enable Mirostat sampling mode.",
  },
  {
    key: "mirostatLr",
    label: "Mirostat learning rate",
    category: "sampling",
    type: "number",
    primaryArg: "--mirostat-lr",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.1",
    helpText: "Mirostat eta parameter.",
  },
  {
    key: "mirostatEnt",
    label: "Mirostat target entropy",
    category: "sampling",
    type: "number",
    primaryArg: "--mirostat-ent",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "5.0",
    helpText: "Mirostat tau parameter.",
  },
  {
    key: "logitBias",
    label: "Logit bias",
    category: "sampling",
    type: "text",
    primaryArg: "--logit-bias",
    aliases: ["-l"],
    placeholder: "15043+1",
    helpText: "Token bias in TOKEN(+/-)BIAS format.",
  },
  {
    key: "grammar",
    label: "Grammar",
    category: "sampling",
    type: "textarea",
    primaryArg: "--grammar",
    helpText: "Inline grammar to constrain generations.",
  },
  {
    key: "grammarFile",
    label: "Grammar file",
    category: "sampling",
    type: "text",
    primaryArg: "--grammar-file",
    placeholder: "C:\\grammars\\json.gbnf",
    helpText: "Grammar file path.",
  },
  {
    key: "jsonSchema",
    label: "JSON schema",
    category: "sampling",
    type: "textarea",
    primaryArg: "--json-schema",
    aliases: ["-j"],
    helpText: "Inline JSON schema that llama.cpp converts to grammar.",
  },
  {
    key: "jsonSchemaFile",
    label: "JSON schema file",
    category: "sampling",
    type: "text",
    primaryArg: "--json-schema-file",
    aliases: ["-jf"],
    placeholder: "C:\\schemas\\output.json",
    helpText: "File containing a JSON schema used to constrain output.",
  },
  {
    key: "backendSampling",
    label: "Backend sampling",
    category: "sampling",
    type: "checkbox",
    primaryArg: "--backend-sampling",
    aliases: ["-bs"],
    helpText: "Enable experimental backend sampling.",
  },
  {
    key: "draftHfRepo",
    label: "Draft model HF repo",
    category: "speculative",
    type: "text",
    primaryArg: "--hf-repo-draft",
    aliases: ["--spec-draft-hf", "-hfd", "-hfrd"],
    placeholder: "ggml-org/Qwen2.5-Coder-0.5B-Q8_0-GGUF",
    helpText: "Hugging Face repo for the draft model.",
  },
  {
    key: "draftThreads",
    label: "Draft threads",
    category: "speculative",
    type: "number",
    primaryArg: "--threads-draft",
    aliases: ["--spec-draft-threads", "-td"],
    placeholder: "4",
    helpText: "Threads used during draft-model generation.",
  },
  {
    key: "draftThreadsBatch",
    label: "Draft threads batch",
    category: "speculative",
    type: "number",
    primaryArg: "--threads-batch-draft",
    aliases: ["--spec-draft-threads-batch", "-tbd"],
    placeholder: "4",
    helpText: "Threads used during batch and prompt processing for the draft model.",
  },
  {
    key: "draftCpuMask",
    label: "Draft CPU mask",
    category: "speculative",
    type: "text",
    primaryArg: "--cpu-mask-draft",
    aliases: ["--spec-draft-cpu-mask", "-Cd"],
    placeholder: "ff",
    helpText: "Draft-model CPU affinity mask.",
  },
  {
    key: "draftCpuRange",
    label: "Draft CPU range",
    category: "speculative",
    type: "text",
    primaryArg: "--cpu-range-draft",
    aliases: ["--spec-draft-cpu-range", "-Crd"],
    placeholder: "0-7",
    helpText: "Draft-model CPU affinity range.",
  },
  {
    key: "draftCpuStrict",
    label: "Draft CPU strict",
    category: "speculative",
    type: "select",
    primaryArg: "--cpu-strict-draft",
    aliases: ["--spec-draft-cpu-strict"],
    options: [
      { value: "", label: "Default" },
      { value: "0", label: "0" },
      { value: "1", label: "1" },
    ],
    helpText: "Use strict CPU placement for the draft model.",
  },
  {
    key: "draftPrio",
    label: "Draft priority",
    category: "speculative",
    type: "number",
    primaryArg: "--prio-draft",
    aliases: ["--spec-draft-prio"],
    placeholder: "0",
    helpText: "Draft-model process or thread priority.",
  },
  {
    key: "draftPoll",
    label: "Draft poll",
    category: "speculative",
    type: "select",
    primaryArg: "--poll-draft",
    aliases: ["--spec-draft-poll"],
    options: [
      { value: "", label: "Default" },
      { value: "0", label: "0" },
      { value: "1", label: "1" },
    ],
    helpText: "Polling behavior for the draft model.",
  },
  {
    key: "draftCpuMaskBatch",
    label: "Draft CPU mask batch",
    category: "speculative",
    type: "text",
    primaryArg: "--cpu-mask-batch-draft",
    aliases: ["--spec-draft-cpu-mask-batch", "-Cbd"],
    placeholder: "ff",
    helpText: "Draft-model batch CPU affinity mask.",
  },
  {
    key: "draftCpuRangeBatch",
    label: "Draft CPU range batch",
    category: "speculative",
    type: "text",
    primaryArg: "--cpu-range-batch-draft",
    aliases: ["--spec-draft-cpu-range-batch", "-Crbd"],
    placeholder: "0-7",
    helpText: "Draft-model batch CPU affinity range.",
  },
  {
    key: "draftCpuStrictBatch",
    label: "Draft CPU strict batch",
    category: "speculative",
    type: "select",
    primaryArg: "--cpu-strict-batch-draft",
    aliases: ["--spec-draft-cpu-strict-batch"],
    options: [
      { value: "", label: "Default" },
      { value: "0", label: "0" },
      { value: "1", label: "1" },
    ],
    helpText: "Strict CPU placement for draft batch processing.",
  },
  {
    key: "draftPrioBatch",
    label: "Draft priority batch",
    category: "speculative",
    type: "number",
    primaryArg: "--prio-batch-draft",
    aliases: ["--spec-draft-prio-batch"],
    placeholder: "0",
    helpText: "Draft-model batch priority.",
  },
  {
    key: "draftPollBatch",
    label: "Draft poll batch",
    category: "speculative",
    type: "select",
    primaryArg: "--poll-batch-draft",
    aliases: ["--spec-draft-poll-batch"],
    options: [
      { value: "", label: "Default" },
      { value: "0", label: "0" },
      { value: "1", label: "1" },
    ],
    helpText: "Draft-model batch polling behavior.",
  },
  {
    key: "draftCacheTypeK",
    label: "Draft cache type K",
    category: "speculative",
    type: "select",
    primaryArg: "--cache-type-k-draft",
    aliases: ["--spec-draft-type-k", "-ctkd"],
    options: [
      { value: "", label: "Default" },
      { value: "f32", label: "f32" },
      { value: "f16", label: "f16" },
      { value: "bf16", label: "bf16" },
      { value: "q8_0", label: "q8_0" },
      { value: "q4_0", label: "q4_0" },
      { value: "q4_1", label: "q4_1" },
      { value: "iq4_nl", label: "iq4_nl" },
      { value: "q5_0", label: "q5_0" },
      { value: "q5_1", label: "q5_1" },
    ],
    helpText: "Draft-model KV cache type for K.",
  },
  {
    key: "draftCacheTypeV",
    label: "Draft cache type V",
    category: "speculative",
    type: "select",
    primaryArg: "--cache-type-v-draft",
    aliases: ["--spec-draft-type-v", "-ctvd"],
    options: [
      { value: "", label: "Default" },
      { value: "f32", label: "f32" },
      { value: "f16", label: "f16" },
      { value: "bf16", label: "bf16" },
      { value: "q8_0", label: "q8_0" },
      { value: "q4_0", label: "q4_0" },
      { value: "q4_1", label: "q4_1" },
      { value: "iq4_nl", label: "iq4_nl" },
      { value: "q5_0", label: "q5_0" },
      { value: "q5_1", label: "q5_1" },
    ],
    helpText: "Draft-model KV cache type for V.",
  },
  {
    key: "draftOverrideTensor",
    label: "Draft override tensor",
    category: "speculative",
    type: "text",
    primaryArg: "--override-tensor-draft",
    aliases: ["--spec-draft-override-tensor", "-otd"],
    placeholder: "blk\\.0=CPU",
    helpText: "Override tensor buffer type for the draft model.",
  },
  {
    key: "draftCpuMoe",
    label: "Draft CPU MoE",
    category: "speculative",
    type: "checkbox",
    primaryArg: "--cpu-moe-draft",
    aliases: ["--spec-draft-cpu-moe", "-cmoed"],
    helpText: "Keep all draft-model MoE weights on CPU.",
  },
  {
    key: "draftNCpuMoe",
    label: "Draft N CPU MoE",
    category: "speculative",
    type: "number",
    primaryArg: "--n-cpu-moe-draft",
    aliases: ["--spec-draft-n-cpu-moe", "--spec-draft-ncmoe", "-ncmoed"],
    placeholder: "0",
    helpText: "Keep the first N draft-model MoE layers on CPU.",
  },
  {
    key: "draftReplace",
    label: "Draft replace",
    category: "speculative",
    type: "text",
    primaryArg: "--spec-draft-replace",
    aliases: ["--spec-replace"],
    placeholder: "TARGET DRAFT",
    helpText: "Two values: TARGET DRAFT token replacement pair.",
    valueCount: 2,
  },
  {
    key: "draftCtxSize",
    label: "Draft context size",
    category: "speculative",
    type: "number",
    primaryArg: "--ctx-size-draft",
    aliases: ["--spec-draft-ctx-size", "-cd"],
    placeholder: "2048",
    helpText: "Prompt context size for the draft model.",
  },
  {
    key: "draftDevice",
    label: "Draft device list",
    category: "speculative",
    type: "text",
    primaryArg: "--device-draft",
    aliases: ["--spec-draft-device", "-devd"],
    placeholder: "CUDA0 or none",
    helpText: "Offload devices for the draft model.",
  },
  {
    key: "draftGpuLayers",
    label: "Draft GPU layers",
    category: "speculative",
    type: "text",
    primaryArg: "--gpu-layers-draft",
    aliases: ["--spec-draft-ngl", "-ngld", "--n-gpu-layers-draft"],
    placeholder: "auto, all, or 12",
    helpText: "Draft-model layers to store in VRAM.",
  },
  {
    key: "draftNMax",
    label: "Draft n max",
    category: "speculative",
    type: "number",
    primaryArg: "--spec-draft-n-max",
    placeholder: "16",
    helpText: "Number of tokens to draft for speculative decoding.",
  },
  {
    key: "draftNMin",
    label: "Draft n min",
    category: "speculative",
    type: "number",
    primaryArg: "--spec-draft-n-min",
    placeholder: "1",
    helpText: "Minimum number of draft tokens for speculative decoding.",
  },
  {
    key: "draftPSplit",
    label: "Draft p split",
    category: "speculative",
    type: "number",
    primaryArg: "--spec-draft-p-split",
    aliases: ["--draft-p-split"],
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.1",
    helpText: "Speculative decoding split probability.",
  },
  {
    key: "draftPMin",
    label: "Draft p min",
    category: "speculative",
    type: "number",
    primaryArg: "--spec-draft-p-min",
    aliases: ["--draft-p-min"],
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.75",
    helpText: "Minimum speculative decoding probability.",
  },
  {
    key: "specType",
    label: "Speculative type",
    category: "speculative",
    type: "select",
    primaryArg: "--spec-type",
    options: [
      { value: "", label: "Default" },
      { value: "none", label: "none" },
      { value: "ngram-cache", label: "ngram-cache" },
      { value: "ngram-simple", label: "ngram-simple" },
      { value: "ngram-map-k", label: "ngram-map-k" },
      { value: "ngram-map-k4v", label: "ngram-map-k4v" },
      { value: "ngram-mod", label: "ngram-mod" },
    ],
    helpText: "Speculative decoding type when no draft model is provided.",
  },
  {
    key: "host",
    label: "Host",
    category: "server",
    type: "text",
    primaryArg: "--host",
    placeholder: "127.0.0.1",
    helpText: "Address to listen on.",
  },
  {
    key: "port",
    label: "Port",
    category: "server",
    type: "number",
    primaryArg: "--port",
    placeholder: "8080",
    helpText: "Port to listen on.",
  },
  {
    key: "reusePort",
    label: "Reuse port",
    category: "server",
    type: "checkbox",
    primaryArg: "--reuse-port",
    helpText: "Allow multiple sockets to bind to the same port.",
  },
  {
    key: "contBatching",
    label: "Continuous batching",
    category: "server",
    type: "select",
    positiveArg: "--cont-batching",
    negativeArg: "--no-cont-batching",
    aliases: ["-cb", "-nocb"],
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Enable dynamic batching on the server.",
  },
  {
    key: "threadsHttp",
    label: "HTTP threads",
    category: "server",
    type: "number",
    primaryArg: "--threads-http",
    placeholder: "4",
    helpText: "Threads used to process HTTP requests.",
  },
  {
    key: "apiPrefix",
    label: "API prefix",
    category: "server",
    type: "text",
    primaryArg: "--api-prefix",
    placeholder: "/v1",
    helpText: "Prefix path served by llama-server.",
  },
  {
    key: "alias",
    label: "Model aliases",
    category: "server",
    type: "text",
    primaryArg: "--alias",
    aliases: ["-a"],
    placeholder: "chat,assistant",
    helpText: "Comma-separated model aliases used by the API.",
  },
  {
    key: "tags",
    label: "Model tags",
    category: "server",
    type: "text",
    primaryArg: "--tags",
    placeholder: "prod,gpu",
    helpText: "Comma-separated informational model tags.",
  },
  {
    key: "webuiConfig",
    label: "WebUI config JSON",
    category: "server",
    type: "textarea",
    primaryArg: "--webui-config",
    helpText: "Inline JSON that overrides default WebUI settings.",
  },
  {
    key: "webuiConfigFile",
    label: "WebUI config file",
    category: "server",
    type: "text",
    primaryArg: "--webui-config-file",
    placeholder: "C:\\configs\\webui.json",
    helpText: "JSON file that overrides default WebUI settings.",
  },
  {
    key: "staticPath",
    label: "Static path",
    category: "server",
    type: "text",
    primaryArg: "--path",
    placeholder: "C:\\llama.cpp\\static",
    helpText: "Path to static files for the server.",
  },
  {
    key: "apiKey",
    label: "API key",
    category: "server",
    type: "text",
    primaryArg: "--api-key",
    placeholder: "key1,key2",
    helpText: "Comma-separated API key list.",
  },
  {
    key: "apiKeyFile",
    label: "API key file",
    category: "server",
    type: "text",
    primaryArg: "--api-key-file",
    placeholder: "C:\\secrets\\api-keys.txt",
    helpText: "File containing one API key per line.",
  },
  {
    key: "sslKeyFile",
    label: "SSL key file",
    category: "server",
    type: "text",
    primaryArg: "--ssl-key-file",
    placeholder: "C:\\certs\\server-key.pem",
    helpText: "PEM-encoded SSL private key file.",
  },
  {
    key: "sslCertFile",
    label: "SSL cert file",
    category: "server",
    type: "text",
    primaryArg: "--ssl-cert-file",
    placeholder: "C:\\certs\\server-cert.pem",
    helpText: "PEM-encoded SSL certificate file.",
  },
  {
    key: "chatTemplateKwargs",
    label: "Chat template kwargs",
    category: "server",
    type: "textarea",
    primaryArg: "--chat-template-kwargs",
    placeholder: '{"key":"value"}',
    helpText: "JSON object string passed to the chat template parser.",
  },
  {
    key: "tools",
    label: "Built-in tools",
    category: "server",
    type: "text",
    primaryArg: "--tools",
    placeholder: "all or read_file,grep_search",
    helpText: "Comma-separated list of built-in server tools.",
  },
  {
    key: "timeout",
    label: "Timeout seconds",
    category: "server",
    type: "number",
    primaryArg: "--timeout",
    aliases: ["-to"],
    placeholder: "600",
    helpText: "Read/write timeout in seconds.",
  },
  {
    key: "cachePrompt",
    label: "Prompt caching",
    category: "server",
    type: "select",
    positiveArg: "--cache-prompt",
    negativeArg: "--no-cache-prompt",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Enable prompt caching on the server.",
  },
  {
    key: "cacheReuse",
    label: "Cache reuse",
    category: "server",
    type: "number",
    primaryArg: "--cache-reuse",
    placeholder: "256",
    helpText: "Minimum chunk size to try reusing via prompt cache.",
  },
  {
    key: "metrics",
    label: "Metrics endpoint",
    category: "server",
    type: "checkbox",
    primaryArg: "--metrics",
    helpText: "Enable Prometheus-compatible metrics endpoint.",
  },
  {
    key: "props",
    label: "Props endpoint",
    category: "server",
    type: "checkbox",
    primaryArg: "--props",
    helpText: "Enable POST /props endpoint.",
  },
  {
    key: "slots",
    label: "Slots endpoint",
    category: "server",
    type: "select",
    positiveArg: "--slots",
    negativeArg: "--no-slots",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Expose" },
      { value: "off", label: "Hide" },
    ],
    helpText: "Expose slots monitoring endpoint.",
  },
  {
    key: "webui",
    label: "Web UI",
    category: "server",
    type: "select",
    positiveArg: "--webui",
    negativeArg: "--no-webui",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Enable the built-in Web UI.",
  },
  {
    key: "webuiMcpProxy",
    label: "Web UI MCP proxy",
    category: "server",
    type: "select",
    positiveArg: "--webui-mcp-proxy",
    negativeArg: "--no-webui-mcp-proxy",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Experimental MCP CORS proxy for the Web UI.",
  },
  {
    key: "embedding",
    label: "Embedding mode",
    category: "server",
    type: "checkbox",
    primaryArg: "--embeddings",
    aliases: ["--embedding"],
    helpText: "Restrict the server to the embedding use case.",
  },
  {
    key: "rerank",
    label: "Reranking endpoint",
    category: "server",
    type: "checkbox",
    primaryArg: "--reranking",
    aliases: ["--rerank"],
    helpText: "Enable the reranking endpoint.",
  },
  {
    key: "slotSavePath",
    label: "Slot save path",
    category: "server",
    type: "text",
    primaryArg: "--slot-save-path",
    placeholder: "C:\\llama-cache\\slots",
    helpText: "Directory where slot KV cache is saved.",
  },
  {
    key: "mediaPath",
    label: "Media path",
    category: "server",
    type: "text",
    primaryArg: "--media-path",
    placeholder: "C:\\llama-media",
    helpText: "Directory for local media files referenced by file:// URLs.",
  },
  {
    key: "modelsDir",
    label: "Models directory",
    category: "server",
    type: "text",
    primaryArg: "--models-dir",
    placeholder: "C:\\models",
    helpText: "Model directory for router mode.",
  },
  {
    key: "modelsPreset",
    label: "Models preset file",
    category: "server",
    type: "text",
    primaryArg: "--models-preset",
    placeholder: "C:\\models\\presets.ini",
    helpText: "INI file with router model presets.",
  },
  {
    key: "modelsMax",
    label: "Models max",
    category: "server",
    type: "number",
    primaryArg: "--models-max",
    placeholder: "0",
    helpText: "Maximum number of router models to load simultaneously.",
  },
  {
    key: "modelsAutoload",
    label: "Models autoload",
    category: "server",
    type: "select",
    positiveArg: "--models-autoload",
    negativeArg: "--no-models-autoload",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Automatically load router models.",
  },
  {
    key: "jinja",
    label: "Jinja engine",
    category: "server",
    type: "select",
    positiveArg: "--jinja",
    negativeArg: "--no-jinja",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "Enable" },
      { value: "off", label: "Disable" },
    ],
    helpText: "Use the Jinja template engine for chat formatting.",
  },
  {
    key: "reasoningFormat",
    label: "Reasoning format",
    category: "server",
    type: "select",
    primaryArg: "--reasoning-format",
    options: [
      { value: "", label: "Default" },
      { value: "auto", label: "auto" },
      { value: "none", label: "none" },
      { value: "deepseek", label: "deepseek" },
      { value: "deepseek-legacy", label: "deepseek-legacy" },
    ],
    helpText: "How thought tags are parsed and returned.",
  },
  {
    key: "reasoning",
    label: "Reasoning",
    category: "server",
    type: "select",
    primaryArg: "--reasoning",
    aliases: ["-rea"],
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "On" },
      { value: "off", label: "Off" },
      { value: "auto", label: "Auto" },
    ],
    helpText: "Use reasoning or thinking in chat mode.",
  },
  {
    key: "reasoningBudget",
    label: "Reasoning budget",
    category: "server",
    type: "number",
    primaryArg: "--reasoning-budget",
    placeholder: "-1",
    helpText: "Token budget for reasoning.",
  },
  {
    key: "reasoningBudgetMessage",
    label: "Reasoning budget message",
    category: "server",
    type: "text",
    primaryArg: "--reasoning-budget-message",
    placeholder: "Budget exhausted",
    helpText: "Message injected when reasoning budget is exhausted.",
  },
  {
    key: "verbosity",
    label: "Verbosity",
    category: "logging",
    type: "number",
    primaryArg: "--verbosity",
    aliases: ["-lv", "--log-verbosity"],
    placeholder: "3",
    helpText: "Logging verbosity threshold.",
  },
  {
    key: "verbose",
    label: "Verbose logging",
    category: "logging",
    type: "checkbox",
    primaryArg: "--verbose",
    aliases: ["-v", "--log-verbose"],
    helpText: "Set verbosity to the maximum logging level.",
  },
  {
    key: "logFile",
    label: "Log file",
    category: "logging",
    type: "text",
    primaryArg: "--log-file",
    placeholder: "C:\\logs\\llama.log",
    helpText: "Write logs to a file.",
  },
  {
    key: "logColors",
    label: "Log colors",
    category: "logging",
    type: "select",
    primaryArg: "--log-colors",
    options: [
      { value: "", label: "Default" },
      { value: "on", label: "On" },
      { value: "off", label: "Off" },
      { value: "auto", label: "Auto" },
    ],
    helpText: "Colored logging behavior.",
  },
  {
    key: "logPrefix",
    label: "Log prefix",
    category: "logging",
    type: "checkbox",
    primaryArg: "--log-prefix",
    helpText: "Enable log prefixes.",
  },
  {
    key: "logTimestamps",
    label: "Log timestamps",
    category: "logging",
    type: "checkbox",
    primaryArg: "--log-timestamps",
    helpText: "Enable timestamps in logs.",
  },
  {
    key: "offline",
    label: "Offline mode",
    category: "logging",
    type: "checkbox",
    primaryArg: "--offline",
    helpText: "Force cache-only behavior and prevent network access.",
  },
];

const state = {
  generatedCommand: "",
  generatedScript: "",
  executableMode: EXECUTABLE_MODE.AUTO,
  presets: {},
};

const elements = {
  form: document.getElementById("builder-form"),
  pathFields: document.getElementById("path-fields"),
  flagGroups: document.getElementById("flag-groups"),
  generateButton: document.getElementById("generate-script"),
  resetButton: document.getElementById("reset-form"),
  copyCommandButton: document.getElementById("copy-command"),
  copyScriptButton: document.getElementById("copy-script"),
  commandOutput: document.getElementById("command-output"),
  scriptOutput: document.getElementById("script-output"),
  validationSummary: document.getElementById("validation-summary"),
  searchInput: document.getElementById("flag-search"),
  schemaStatus: document.getElementById("schema-status"),
  fieldTemplate: document.getElementById("field-template"),
  presetNameInput: document.getElementById("preset-name"),
  presetList: document.getElementById("preset-list"),
  savePresetButton: document.getElementById("save-preset"),
  loadPresetButton: document.getElementById("load-preset"),
  deletePresetButton: document.getElementById("delete-preset"),
  executableModeNote: document.getElementById("executable-mode"),
};

initialize();

function initialize() {
  renderStaticFields();
  renderFlagGroups();
  elements.schemaStatus.textContent = SCHEMA_SOURCE_NOTE;
  elements.commandOutput.textContent = "Generate a command to see output here.";
  elements.scriptOutput.textContent = "Generate a script to see output here.";

  elements.generateButton.addEventListener("click", handleGenerate);
  elements.resetButton.addEventListener("click", handleReset);
  elements.copyCommandButton.addEventListener("click", () => copyOutput(state.generatedCommand, "Command copied."));
  elements.copyScriptButton.addEventListener("click", () => copyOutput(state.generatedScript, "Script copied."));
  elements.searchInput.addEventListener("input", handleSearch);

  elements.savePresetButton.addEventListener("click", handleSavePreset);
  elements.loadPresetButton.addEventListener("click", handleLoadPreset);
  elements.deletePresetButton.addEventListener("click", handleDeletePreset);
  const executableInput = document.getElementById("executablePath");
  executableInput.addEventListener("input", applyExecutableModeFromPath);

  loadPresets();
  applyExecutableModeFromPath();
}

function renderStaticFields() {
  STATIC_FIELDS.forEach((field) => {
    const card = createFieldCard(field);
    elements.pathFields.appendChild(card);
  });
}

function renderFlagGroups() {
  CATEGORY_ORDER.forEach((categoryKey, index) => {
    const categoryFields = FLAG_SCHEMA.filter((field) => field.category === categoryKey);
    if (categoryFields.length === 0) {
      return;
    }

    const details = document.createElement("details");
    details.className = "accordion";
    details.open = index < 2;
    details.dataset.category = categoryKey;

    const summary = document.createElement("summary");

    const copyWrap = document.createElement("div");
    copyWrap.className = "accordion-summary-copy";

    const title = document.createElement("strong");
    title.textContent = CATEGORY_META[categoryKey].title;
    copyWrap.appendChild(title);

    const description = document.createElement("span");
    description.textContent = CATEGORY_META[categoryKey].description;
    description.className = "field-help";
    copyWrap.appendChild(description);

    const badge = document.createElement("span");
    badge.className = "accordion-badge";
    badge.textContent = `${categoryFields.length} fields`;

    summary.append(copyWrap, badge);

    const body = document.createElement("div");
    body.className = "accordion-body";

    const grid = document.createElement("div");
    grid.className = "field-grid";

    categoryFields.forEach((field) => {
      const card = createFieldCard(field);
      card.dataset.searchIndex = buildSearchIndex(field);
      card.dataset.fieldKey = field.key;
      card.dataset.category = field.category;
      grid.appendChild(card);
    });

    body.appendChild(grid);
    details.append(summary, body);
    elements.flagGroups.appendChild(details);
  });
}

function createFieldCard(field) {
  const fragment = elements.fieldTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".field-card");
  const label = fragment.querySelector(".field-label");
  const controlWrap = fragment.querySelector(".field-control");
  const help = fragment.querySelector(".field-help");
  const meta = fragment.querySelector(".field-meta");

  card.dataset.fieldKey = field.key;
  card.dataset.category = field.category;

  label.textContent = field.label;
  help.textContent = field.helpText || "";
  meta.textContent = formatMeta(field);

  if (field.type === "path-picker") {
    controlWrap.appendChild(createPathPicker(field));
  } else if (field.type === "textarea") {
    controlWrap.appendChild(createTextarea(field));
  } else if (field.type === "select") {
    controlWrap.appendChild(createSelect(field));
  } else if (field.type === "checkbox") {
    controlWrap.appendChild(createCheckbox(field));
  } else {
    controlWrap.appendChild(createInput(field));
  }

  return card;
}

function createInput(field) {
  const input = document.createElement("input");
  input.type = field.type === "number" ? "number" : "text";
  input.id = field.key;
  input.name = field.key;
  input.placeholder = field.placeholder || "";
  input.dataset.kind = field.type;

  if (field.required) {
    input.required = true;
  }

  if (field.inputMode) {
    input.inputMode = field.inputMode;
  }

  if (field.step) {
    input.step = field.step;
  }

  return input;
}

function createTextarea(field) {
  const textarea = document.createElement("textarea");
  textarea.id = field.key;
  textarea.name = field.key;
  textarea.placeholder = field.placeholder || "";
  return textarea;
}

function createSelect(field) {
  const select = document.createElement("select");
  select.id = field.key;
  select.name = field.key;

  field.options.forEach((option) => {
    const optionNode = document.createElement("option");
    optionNode.value = option.value;
    optionNode.textContent = option.label;
    select.appendChild(optionNode);
  });

  return select;
}

function createCheckbox(field) {
  const wrapper = document.createElement("label");
  wrapper.className = "checkbox-row";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = field.key;
  checkbox.name = field.key;

  const text = document.createElement("span");
  text.textContent = `Include ${field.primaryArg}`;

  wrapper.append(checkbox, text);
  return wrapper;
}

function createPathPicker(field) {
  const wrapper = document.createElement("div");

  const pickerRow = document.createElement("div");
  pickerRow.className = "picker-row";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = field.key;
  textInput.name = field.key;
  textInput.placeholder = field.placeholder || "";
  textInput.autocomplete = "off";
  if (field.required) {
    textInput.required = true;
  }

  const pickerButton = document.createElement("button");
  pickerButton.type = "button";
  pickerButton.className = "picker-button";
  pickerButton.textContent = `Choose ${field.kindLabel}`;

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "file";
  hiddenInput.className = "hidden-input";
  hiddenInput.accept = field.accepts || "";

  const pickerStatus = document.createElement("p");
  pickerStatus.className = "picker-status";
  pickerStatus.textContent = "No file selected.";

  const pickerCaption = document.createElement("p");
  pickerCaption.className = "picker-caption";
  pickerCaption.textContent = "The picker can provide a file name, but local browsers usually do not reveal the full path.";

  pickerButton.addEventListener("click", async () => {
    if (window.showOpenFilePicker) {
      try {
        const [handle] = await window.showOpenFilePicker({
          multiple: false,
          types: field.accepts ? [{ description: field.kindLabel, accept: { "application/octet-stream": field.accepts.split(",") } }] : undefined,
        });
        if (handle) {
          textInput.value = textInput.value.trim() || handle.name;
          pickerStatus.textContent = `Picked: ${handle.name}. Replace with a full Windows path if needed.`;
        }
        return;
      } catch (error) {
        if (error && error.name !== "AbortError") {
          pickerStatus.textContent = "Picker API failed. Falling back to standard file input.";
        }
      }
    }

    hiddenInput.click();
  });

  hiddenInput.addEventListener("change", () => {
    const file = hiddenInput.files && hiddenInput.files[0];
    if (!file) {
      pickerStatus.textContent = "No file selected.";
      return;
    }

    textInput.value = textInput.value.trim() || file.name;
    pickerStatus.textContent = `Picked: ${file.name}. Replace with a full Windows path if needed.`;
  });

  pickerRow.append(textInput, pickerButton, hiddenInput);
  wrapper.append(pickerRow, pickerStatus, pickerCaption);
  return wrapper;
}

function formatMeta(field) {
  const args = [];

  if (field.primaryArg) {
    args.push(field.primaryArg);
  }
  if (field.positiveArg) {
    args.push(field.positiveArg);
  }
  if (field.negativeArg) {
    args.push(field.negativeArg);
  }
  if (field.aliases && field.aliases.length) {
    args.push(...field.aliases);
  }

  return args.length ? `Flags: ${args.join(", ")}` : "";
}

function buildSearchIndex(field) {
  return [field.label, field.helpText, field.primaryArg, field.positiveArg, field.negativeArg, ...(field.aliases || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function handleSearch() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const cards = elements.flagGroups.querySelectorAll(".field-card");

  cards.forEach((card) => {
    const matches = !query || (card.dataset.searchIndex || "").includes(query);
    card.classList.toggle("is-hidden-search", !matches);
  });

  updateAccordionVisibility();
}

function applyExecutableModeFromPath() {
  const executablePath = document.getElementById("executablePath")?.value || "";
  state.executableMode = detectExecutableMode(executablePath);
  elements.executableModeNote.textContent = `Executable mode: ${state.executableMode}`;

  const cards = elements.flagGroups.querySelectorAll(".field-card");
  cards.forEach((card) => {
    const fieldKey = card.dataset.fieldKey;
    const visible = isFieldVisibleForMode(fieldKey, state.executableMode);
    card.classList.toggle("is-hidden-mode", !visible);
  });

  updateAccordionVisibility();
}

function detectExecutableMode(executablePath) {
  const normalized = String(executablePath).toLowerCase();
  if (!normalized) {
    return EXECUTABLE_MODE.AUTO;
  }

  if (normalized.includes("llama-server")) {
    return EXECUTABLE_MODE.SERVER;
  }

  if (normalized.includes("llama-cli") || normalized.includes("llama-completion") || normalized.includes("llama-gemma3-cli")) {
    return EXECUTABLE_MODE.CLI;
  }

  return EXECUTABLE_MODE.AUTO;
}

function isFieldVisibleForMode(fieldKey, mode) {
  if (mode === EXECUTABLE_MODE.AUTO) {
    return true;
  }

  const field = FLAG_SCHEMA.find((entry) => entry.key === fieldKey);
  if (!field) {
    return true;
  }

  if (mode === EXECUTABLE_MODE.CLI) {
    if (field.category === "server") {
      return false;
    }
    return true;
  }

  if (mode === EXECUTABLE_MODE.SERVER) {
    if (CLI_ONLY_KEYS.has(fieldKey)) {
      return false;
    }
    return true;
  }

  return true;
}

function updateAccordionVisibility() {
  const groups = elements.flagGroups.querySelectorAll(".accordion");
  groups.forEach((group) => {
    const cards = group.querySelectorAll(".field-card");
    const hasVisible = Array.from(cards).some((card) => !card.classList.contains("is-hidden-search") && !card.classList.contains("is-hidden-mode"));
    group.classList.toggle("is-hidden-mode", !hasVisible);
  });
}

function loadPresets() {
  try {
    const raw = localStorage.getItem(PRESET_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    state.presets = parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    state.presets = {};
  }

  refreshPresetList();
}

function persistPresets() {
  localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(state.presets));
}

function refreshPresetList(selectedName = "") {
  const names = Object.keys(state.presets).sort((left, right) => left.localeCompare(right));
  elements.presetList.innerHTML = "";

  if (names.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No presets saved";
    elements.presetList.appendChild(option);
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a preset";
  elements.presetList.appendChild(placeholder);

  names.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    elements.presetList.appendChild(option);
  });

  if (selectedName && state.presets[selectedName]) {
    elements.presetList.value = selectedName;
  }
}

function handleSavePreset() {
  const presetName = elements.presetNameInput.value.trim();
  if (!presetName) {
    showErrors(["Preset name is required to save."]);
    return;
  }

  state.presets[presetName] = readFormValues();
  persistPresets();
  refreshPresetList(presetName);
  showInfo(`Preset '${presetName}' saved.`);
}

function handleLoadPreset() {
  const selected = elements.presetList.value;
  if (!selected || !state.presets[selected]) {
    showErrors(["Select a preset to load."]);
    return;
  }

  applyValuesToForm(state.presets[selected]);
  elements.presetNameInput.value = selected;
  showInfo(`Preset '${selected}' loaded.`);
}

function handleDeletePreset() {
  const selected = elements.presetList.value;
  if (!selected || !state.presets[selected]) {
    showErrors(["Select a preset to delete."]);
    return;
  }

  delete state.presets[selected];
  persistPresets();
  refreshPresetList();
  if (elements.presetNameInput.value.trim() === selected) {
    elements.presetNameInput.value = "";
  }
  showInfo(`Preset '${selected}' deleted.`);
}

function applyValuesToForm(values) {
  STATIC_FIELDS.forEach((field) => {
    const node = document.getElementById(field.key);
    if (!node) {
      return;
    }
    node.value = values[field.key] || "";
  });

  FLAG_SCHEMA.forEach((field) => {
    const node = document.getElementById(field.key);
    if (!node) {
      return;
    }

    if (field.type === "checkbox") {
      node.checked = Boolean(values[field.key]);
      return;
    }

    node.value = values[field.key] ?? "";
  });

  applyExecutableModeFromPath();
  handleSearch();
}

function handleGenerate() {
  const values = readFormValues();
  const errors = validateValues(values);

  if (errors.length) {
    showErrors(errors);
    return;
  }

  clearErrors();
  const commandParts = buildCommandParts(values);
  state.generatedCommand = buildPowerShellCommand(values.executablePath, commandParts);
  state.generatedScript = buildPowerShellScript(values.executablePath, commandParts);

  elements.commandOutput.textContent = state.generatedCommand;
  elements.scriptOutput.textContent = state.generatedScript;
}

function handleReset() {
  elements.form.reset();
  clearErrors();
  state.generatedCommand = "";
  state.generatedScript = "";
  elements.commandOutput.textContent = "Generate a command to see output here.";
  elements.scriptOutput.textContent = "Generate a script to see output here.";

  document.querySelectorAll(".picker-status").forEach((node) => {
    node.textContent = "No file selected.";
  });

  applyExecutableModeFromPath();
  handleSearch();
}

function readFormValues() {
  const values = {};

  STATIC_FIELDS.forEach((field) => {
    const node = document.getElementById(field.key);
    values[field.key] = node ? node.value.trim() : "";
  });

  FLAG_SCHEMA.forEach((field) => {
    const node = document.getElementById(field.key);
    if (!node) {
      values[field.key] = "";
      return;
    }

    if (field.type === "checkbox") {
      values[field.key] = node.checked;
      return;
    }

    values[field.key] = node.value.trim();
  });

  return values;
}

function validateValues(values) {
  const errors = [];

  if (!values.executablePath) {
    errors.push("Executable path is required.");
  }
  if (!values.modelPath) {
    errors.push("Model path is required.");
  }

  const promptSources = [values.prompt, values.promptFile, values.binaryFile].filter(Boolean).length;
  if (promptSources > 1) {
    errors.push("Use only one prompt source: Prompt, Prompt file, or Binary prompt file.");
  }

  FLAG_SCHEMA.forEach((field) => {
    const value = values[field.key];
    if (!field.valueCount || !value) {
      return;
    }

    const parts = splitMultiValue(value);
    if (parts.length !== field.valueCount) {
      errors.push(`${field.label} requires exactly ${field.valueCount} values.`);
    }
  });

  return errors;
}

function showErrors(errors) {
  elements.validationSummary.hidden = false;
  elements.validationSummary.style.borderColor = "rgba(182, 63, 43, 0.22)";
  elements.validationSummary.style.background = "rgba(182, 63, 43, 0.08)";
  elements.validationSummary.style.color = "#b63f2b";
  elements.validationSummary.innerHTML = errors.map((error) => `<div>${escapeHtml(error)}</div>`).join("");
}

function clearErrors() {
  elements.validationSummary.hidden = true;
  elements.validationSummary.textContent = "";
  elements.validationSummary.style.borderColor = "rgba(182, 63, 43, 0.22)";
  elements.validationSummary.style.background = "rgba(182, 63, 43, 0.08)";
  elements.validationSummary.style.color = "#b63f2b";
}

function showInfo(message) {
  elements.validationSummary.hidden = false;
  elements.validationSummary.style.borderColor = "rgba(13, 124, 102, 0.22)";
  elements.validationSummary.style.background = "rgba(13, 124, 102, 0.08)";
  elements.validationSummary.style.color = "#0a5e4d";
  elements.validationSummary.textContent = message;
}

function buildCommandParts(values) {
  const parts = [];

  addValueArg(parts, "--model", values.modelPath);
  addValueArg(parts, "--spec-draft-model", values.draftModelPath);

  FLAG_SCHEMA.forEach((field) => {
    if (!isFieldVisibleForMode(field.key, state.executableMode)) {
      return;
    }

    const value = values[field.key];

    if (field.type === "checkbox") {
      if (value) {
        parts.push(field.primaryArg);
      }
      return;
    }

    if (field.type === "select" && field.positiveArg && field.negativeArg) {
      if (value === "on") {
        parts.push(field.positiveArg);
      } else if (value === "off") {
        parts.push(field.negativeArg);
      }
      return;
    }

    if (value === "") {
      return;
    }

    if (field.valueCount) {
      const splitValues = splitMultiValue(value);
      if (splitValues.length === field.valueCount) {
        parts.push(field.primaryArg, ...splitValues);
      }
      return;
    }

    if (field.type === "select" || field.type === "number" || field.type === "text" || field.type === "textarea") {
      addValueArg(parts, field.primaryArg, value);
    }
  });

  return parts;
}

function addValueArg(parts, arg, value) {
  if (!arg || value === undefined || value === null || value === "") {
    return;
  }

  parts.push(arg, value);
}

function splitMultiValue(value) {
  return String(value)
    .split(/[\s,]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function buildPowerShellCommand(executablePath, commandParts) {
  const serialized = [`& ${quotePowerShell(executablePath)}`];

  for (let index = 0; index < commandParts.length; index += 1) {
    const current = commandParts[index];
    if (!current.startsWith("-")) {
      continue;
    }

    const next = commandParts[index + 1];
    if (next && !next.startsWith("-")) {
      serialized.push(current, quoteIfNeeded(next));
      index += 1;
    } else {
      serialized.push(current);
    }
  }

  return serialized.join(" ");
}

function buildPowerShellScript(executablePath, commandParts) {
  const lines = [
    `$exe = ${quotePowerShell(executablePath)}`,
    "",
    "& $exe `",
  ];

  const formattedArgs = [];

  for (let index = 0; index < commandParts.length; index += 1) {
    const current = commandParts[index];
    if (!current.startsWith("-")) {
      continue;
    }

    const next = commandParts[index + 1];
    if (next && !next.startsWith("-")) {
      formattedArgs.push(`  ${current} ${quoteIfNeeded(next)} ` + "`");
      index += 1;
    } else {
      formattedArgs.push(`  ${current} ` + "`");
    }
  }

  if (formattedArgs.length === 0) {
    lines[2] = "& $exe";
    return lines.join("\n");
  }

  const lastIndex = formattedArgs.length - 1;
  formattedArgs[lastIndex] = formattedArgs[lastIndex].replace(/\s`$/, "");
  lines.push(...formattedArgs);
  return lines.join("\n");
}

function quoteIfNeeded(value) {
  const normalized = String(value);
  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    return normalized;
  }
  return quotePowerShell(normalized);
}

function quotePowerShell(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function copyOutput(content, successMessage) {
  if (!content) {
    return;
  }

  try {
    await navigator.clipboard.writeText(content);
    showInfo(successMessage);
  } catch (error) {
    showErrors(["Clipboard access failed. Copy the generated output manually."]);
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}