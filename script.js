// Sample data for the application
let currentUser = null;
let materials = [
    {
        id: 1,
        title: "Calculus I Notes",
        semester: 1,
        subject: "math",
        type: "notes",
        description: "Complete notes for Calculus I covering limits, derivatives, and integrals.",
        uploadedBy: "Priya Sharma",
        uploadDate: "2025-02-15",
        rating: 4.5,
        downloadCount: 124,
        fileName: "calculus_notes.pdf"
    },
    {
        id: 2,
        title: "Physics Mechanics Assignment",
        semester: 1,
        subject: "physics",
        type: "assignment",
        description: "Practice problems for mechanics section.",
        uploadedBy: "Rahul Patel",
        uploadDate: "2025-02-10",
        rating: 4.2,
        downloadCount: 87,
        fileName: "mechanics_assignment.pdf"
    },
    {
        id: 3,
        title: "Chemistry Organic Reactions",
        semester: 2,
        subject: "chemistry",
        type: "notes",
        description: "Detailed notes on organic reactions in chemistry.",
        uploadedBy: "Amit Kumar",
        uploadDate: "2025-03-10",
        rating: 4.7,
        downloadCount: 150,
        fileName: "organic_reactions_notes.pdf"
    },
    {
        id: 4,
        title: "Data Structures and Algorithms Practice Problems",
        semester: 3,
        subject: "computer science",
        type: "assignment",
        description: "A collection of practice problems to improve your understanding of data structures and algorithms.",
        uploadedBy: "Neha Gupta",
        uploadDate: "2025-03-12",
        rating: 4.8,
        downloadCount: 200,
        fileName: "data_structures_practice.pdf"
    },
    {
        id: 5,
        title: "Linear Algebra Lecture Notes",
        semester: 2,
        subject: "math",
        type: "notes",
        description: "Comprehensive notes for Linear Algebra, covering matrices, vectors, and linear transformations.",
        uploadedBy: "Sandeep Verma",
        uploadDate: "2025-03-08",
        rating: 4.6,
        downloadCount: 145,
        fileName: "linear_algebra_notes.pdf"
    },
    {
        id: 6,
        title: "Operating Systems Basics Assignment",
        semester: 4,
        subject: "computer science",
        type: "assignment",
        description: "Assignments focused on basic concepts in operating systems, including process management and scheduling.",
        uploadedBy: "Ravi Mishra",
        uploadDate: "2025-03-09",
        rating: 4.4,
        downloadCount: 112,
        fileName: "os_basics_assignment.pdf"
    },
    {
        id: 7,
        title: "Introduction to Artificial Intelligence Notes",
        semester: 5,
        subject: "computer science",
        type: "notes",
        description: "Introduction to the concepts of Artificial Intelligence, including search algorithms and machine learning.",
        uploadedBy: "Sonia Desai",
        uploadDate: "2025-03-13",
        rating: 4.9,
        downloadCount: 180,
        fileName: "ai_introduction_notes.pdf"
    },
    {
        id: 8,
        title: "Microeconomics Study Guide",
        semester: 1,
        subject: "economics",
        type: "study guide",
        description: "Study guide for the microeconomics course, covering demand, supply, and market equilibrium.",
        uploadedBy: "Karan Singh",
        uploadDate: "2025-03-11",
        rating: 4.3,
        downloadCount: 98,
        fileName: "microeconomics_study_guide.pdf"
    },
    {
        id: 9,
        title: "JavaScript Programming Notes",
        semester: 2,
        subject: "computer science",
        type: "notes",
        description: "Notes for JavaScript programming covering syntax, functions, and object-oriented programming.",
        uploadedBy: "Sahil Patel",
        uploadDate: "2025-03-07",
        rating: 4.6,
        downloadCount: 130,
        fileName: "javascript_notes.pdf"
    },
    {
        id: 10,
        title: "Calculus II Assignment",
        semester: 2,
        subject: "math",
        type: "assignment",
        description: "Practice problems for Calculus II, focusing on integrals and series.",
        uploadedBy: "Meera Agarwal",
        uploadDate: "2025-03-14",
        rating: 4.5,
        downloadCount: 90,
        fileName: "calculus2_assignment.pdf"
    }
];

// DOM elements
const homeView = document.getElementById('homeView');
const uploadView = document.getElementById('uploadView');
const myMaterialsView = document.getElementById('myMaterialsView');
const materialDetailView = document.getElementById('materialDetailView');
const materialsList = document.getElementById('materialsList');
const myMaterialsList = document.getElementById('myMaterialsList');
const materialDetail = document.getElementById('materialDetail');
const searchBar = document.getElementById('searchBar');
const semesterFilter = document.getElementById('semesterFilter');
const subjectFilter = document.getElementById('subjectFilter');
const typeFilter = document.getElementById('typeFilter');

// Navigation buttons
const homeBtn = document.getElementById('homeBtn');
const uploadBtn = document.getElementById('uploadBtn');
const myMaterialsBtn = document.getElementById('myMaterialsBtn');
const loginBtn = document.getElementById('githubLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const backBtn = document.getElementById('backBtn');

// User info elements
const userInfo = document.getElementById("userInfo");
const username = document.getElementById("username");
const userAvatar = document.getElementById("userAvatar");

// Check GitHub authentication status
function checkAuthStatus() {
    fetch("http://localhost:5002/user", { credentials: "include" })
        .then(response => response.json())
        .then(user => {
            if (user) {
                showUser(user);
            } else {
                hideUser();
            }
        });
}

// Show user info after login
function showUser(user) {
    currentUser = user;
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    userInfo.classList.remove("hidden");
    username.textContent = user.displayName || user.username;
    userAvatar.src = user.photos[0].value;
}

// Hide user info after logout
function hideUser() {
    currentUser = null;
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    userInfo.classList.add("hidden");
    username.textContent = "";
    userAvatar.src = "";
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    checkAuthStatus();
    displayMaterials(materialsList, materials);

    // ✅ Ensure filters trigger the function
    searchBar.addEventListener("keyup", filterMaterials);
    semesterFilter.addEventListener("change", filterMaterials);
    subjectFilter.addEventListener("change", filterMaterials);
    typeFilter.addEventListener("change", filterMaterials);

    loginBtn.addEventListener("click", () => {
        window.location.href = "http://localhost:5002/auth/github";
    });

    logoutBtn.addEventListener("click", () => {
        fetch("http://localhost:5002/logout", { credentials: "include" })
            .then(() => {
                hideUser();
            });
    });
    

    homeBtn.addEventListener('click', () => {
        showView(homeView);
        setActiveButton(homeBtn);
        displayMaterials(materialsList, materials);
    });

    uploadBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert('Please login to upload materials');
            return;
        }
        showView(uploadView);
        setActiveButton(uploadBtn);
    });

    myMaterialsBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert('Please login to view your materials');
            return;
        }
        const userMaterials = materials.filter(m => m.uploadedBy === currentUser.displayName);
        displayMaterials(myMaterialsList, userMaterials);
        showView(myMaterialsView);
        setActiveButton(myMaterialsBtn);
    });

    backBtn.addEventListener('click', () => {
        showView(homeView);
        setActiveButton(homeBtn);
    });
});

// Display materials function
function displayMaterials(targetElement, materialsList) {
    targetElement.innerHTML = '';
    if (materialsList.length === 0) {
        targetElement.innerHTML = '<p>No materials found.</p>';
        return;
    }

    materialsList.forEach(material => {
        const card = document.createElement('div');
        card.className = 'material-card';
        card.innerHTML = `
            <h3>${material.title}</h3>
            <div class="material-meta">
                <div>Subject: ${material.subject}</div>
                <div>Semester: ${material.semester}</div>
                <div>Uploaded by: ${material.uploadedBy}</div>
                <div>Date: ${material.uploadDate}</div>
            </div>
            <div class="rating">${material.rating} ★ (${material.downloadCount} downloads)</div>
            <div class="material-actions">
                <button class="view-btn" data-id="${material.id}">View Details</button>
                <button class="download-btn" data-id="${material.id}">Download</button>
            </div>
        `;
        targetElement.appendChild(card);
    });

    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const materialId = parseInt(e.target.getAttribute('data-id'));
            showMaterialDetail(materialId);
        });
    });

    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const materialId = parseInt(e.target.getAttribute('data-id'));
            downloadMaterial(materialId);
        });
    });
}

// Filtering Function
function filterMaterials() {
    console.log("Filtering triggered!");
    const searchText = searchBar.value.toLowerCase();
    const semester = semesterFilter.value ? Number(semesterFilter.value) : ""; // ✅ Ensure it's a number
    const subject = subjectFilter.value.trim();
    const type = typeFilter.value.trim();

    const filteredMaterials = materials.filter(material => {
        const matchesSearch = searchText === "" || material.title.toLowerCase().includes(searchText);
        const matchesSemester = semester === "" || material.semester === semester; // ✅ Compare as numbers
        const matchesSubject = subject === "" || material.subject === subject;
        const matchesType = type === "" || material.type === type;

        return matchesSearch && matchesSemester && matchesSubject && matchesType;
    });

    console.log("Filtered Materials:", filteredMaterials);
    displayMaterials(materialsList, filteredMaterials);
}

// Download Material Function
function downloadMaterial(materialId) {
    const material = materials.find(m => m.id === materialId);
    if (!material) return;
    
    alert(`Downloading: ${material.fileName}`); // Simulated download
}

// Show material details
function showMaterialDetail(materialId) {
    const material = materials.find(m => m.id === materialId);
    if (!material) return;

    materialDetail.innerHTML = `
        <h2>${material.title}</h2>
        <p><strong>Subject:</strong> ${material.subject}</p>
        <p><strong>Semester:</strong> ${material.semester}</p>
        <p><strong>Uploaded by:</strong> ${material.uploadedBy}</p>
        <p><strong>Date:</strong> ${material.uploadDate}</p>
        <p><strong>Description:</strong> ${material.description}</p>
        <button class="download-btn" data-id="${material.id}">Download Material</button>
    `;

    showView(materialDetailView);
}
