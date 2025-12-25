let emails = JSON.parse(localStorage.getItem("emails")) || [];
let emailIdCounter = parseInt(localStorage.getItem("emailIdCounter")) || 1;
let currentFolder = "inbox";
let selectedEmail = null;
let userEmail = localStorage.getItem("userEmail") || "user@mail.com";

// ELEMENTS
const emailsList = document.getElementById("emailsList");
const reader = document.getElementById("reader");
const readerTitle = document.getElementById("readerTitle");
const readerSender = document.getElementById("readerSender");
const readerDate = document.getElementById("readerDate");
const readerText = document.getElementById("readerText");
const readerFiles = document.getElementById("readerFiles");
const attachmentsList = document.getElementById("attachmentsList");
const inboxCount = document.getElementById("inboxCount");
const trashCount = document.getElementById("trashCount");
const currentFolderTitle = document.getElementById("currentFolder");
const userEmailSpan = document.getElementById("userEmail");

const composeBtn = document.getElementById("composeBtn");
const composeModal = document.getElementById("compose
