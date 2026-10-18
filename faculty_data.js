/**
 * =========================================================================
 * University of Sri Jayewardenepura - Faculty of Engineering (FOE)
 * Unified Knowledge Base & Dynamic Data Model
 * 
 * NOTE TO DEVELOPER / USER:
 * You can effortlessly expand or update this dataset at any time!
 * Just add or edit objects in the 'departments', 'facilities', or 'news' arrays.
 * =========================================================================
 */

const FOE_DATA = {
  faculty: {
    name: "Faculty of Engineering",
    university: "University of Sri Jayewardenepura",
    sinhalaName: "ඉංජිනේරු පීඨය - ශ්‍රී ජයවර්ධනපුර විශ්වවිද්‍යාලය",
    established: 2016,
    tagline: "Synergizing Disciplines to Engineer Tomorrow",
    shortTagline: "Innovate • Engineer • Transform",
    address: "No 120, Polgasowita Road, Mattegoda, Sri Lanka",
    phone: "+94 11 273 1582",
    email: "foe@sjp.ac.lk",
    website: "https://eng.sjp.ac.lk",
    dean: {
      name: "Dr. Nishan Dharmaweera",
      title: "Dean, Faculty of Engineering",
      message: "The Faculty of Engineering of the University of Sri Jayewardenepura is the latest addition to the engineering faculties of the state-owned universities in Sri Lanka. The faculty offers the Bachelor of the Science of Engineering degree in four disciplines: Civil Engineering, Computer Engineering, Electrical and Electronic Engineering, and Mechanical Engineering. Our curricula follow recognized IESL standards. We prepare forward-thinking engineering innovators ready to engineer tomorrow's world.",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/01/WhatsApp-Image-2023-11-21-at-15.31.23-2-e1704771521619.jpeg"
    },
    vision: "To be a centre of excellence in higher education and research in engineering, empowering innovators who serve society through technological ingenuity and ethical leadership.",
    mission: "Produce engineering graduates with the knowledge and aspiration to become competent engineers in conventional and emerging engineering spheres by offering a flexible curriculum meeting global standards.",
    stats: [
      { label: "Departments of Study", value: "05", icon: "bi-building-gear", suffix: "" },
      { label: "Engineering Disciplines", value: "04", icon: "bi-award", suffix: " Specializations" },
      { label: "Research & Hi-Tech Labs", value: "24", icon: "bi-cpu", suffix: "+" },
      { label: "Undergraduates & Scholars", value: "1200", icon: "bi-people", suffix: "+" },
      { label: "Graduate Employability", value: "100", icon: "bi-graph-up-arrow", suffix: "%" },
      { label: "Engineering Recognition", value: "IESL", icon: "bi-shield-check", suffix: " Recognized" }
    ],
    socialLinks: {
      facebook: "https://www.facebook.com/foeSJP",
      twitter: "https://x.com/SJPFOE",
      youtube: "https://www.youtube.com/@facultyofengineeringusj5887",
      website: "https://eng.sjp.ac.lk",
      centralUni: "https://www.sjp.ac.lk"
    },
    quickPortals: [
      { name: "FOE LMS", url: "https://eng.sjp.ac.lk/cm/index.php", desc: "Course materials, submissions & grading", icon: "bi-mortarboard" },
      { name: "Student MIS", url: "https://mis.eng.sjp.ac.lk/", desc: "Results, registration & transcripts", icon: "bi-database-check" },
      { name: "Central Library", url: "https://eng.sjp.ac.lk/library-foe/", desc: "Digital catalogs, e-resources & study spaces", icon: "bi-journal-bookmark" },
      { name: "IT Centre", url: "https://eng.sjp.ac.lk/it-centre-foe/", desc: "Campus network, Wi-Fi & IT support", icon: "bi-wifi" },
      { name: "ConTRE 2026", url: "https://contre.lk/", desc: "International Research Conference", icon: "bi-globe-americas" }
    ]
  },

  // -------------------------------------------------------------------------
  // DEPARTMENTS
  // -------------------------------------------------------------------------
  departments: [
    {
      id: "civil",
      name: "Civil Engineering",
      code: "CE",
      color: "from-amber-500/20 to-orange-600/30",
      accent: "#f59e0b",
      icon: "bi-cone-striped",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Civil-Engineering-Building.jpg",
      tagline: "Building Resilient Infrastructure for Future Generations",
      overview: "The Department of Civil Engineering trains versatile professionals equipped to design, construct, and sustain structures, transportation systems, geotechnical wonders, and environmental hydraulic networks.",
      degree: "B.Sc. Eng (Hons) in Civil Engineering (4 Years - SLQF Level 8)",
      keyLabs: [
        "Advanced Structural Mechanics & Testing Bay",
        "Fluid Mechanics & Hydraulics Wave Flume Laboratory",
        "Soil Mechanics, Geology & Geotechnical Testing Lab",
        "Highway Materials & Pavement Engineering Suite",
        "Environmental Engineering & Water Quality Lab"
      ],
      minorOptions: ["Building Services Engineering", "Environmental Engineering"],
      careerOpportunities: [
        "Structural Consultant & High-rise Designer",
        "Geotechnical & Foundation Engineer",
        "Hydraulic & Coastal Infrastructure Specialist",
        "Transportation & Urban Systems Planner"
      ]
    },
    {
      id: "computer",
      name: "Computer Engineering",
      code: "CO",
      color: "from-sky-500/20 to-indigo-600/30",
      accent: "#38bdf8",
      icon: "bi-cpu-fill",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg",
      tagline: "Pioneering Intelligent Computing, Edge AI & Cloud Systems",
      overview: "The Department of Computer Engineering delivers deep mastery across algorithmic intelligence, computer architecture, secure networks, IoT embedded platforms, robotics, and scalable software systems.",
      degree: "B.Sc. Eng (Hons) in Computer Engineering (4 Years - IESL Recognized)",
      keyLabs: [
        "Artificial Intelligence & Machine Learning Research Hub",
        "High-Performance Computing (HPC) & GPU Cluster",
        "Embedded Systems, Robotics & IoT Innovation Lab",
        "Network Security & Cyber Warfare Simulation Lab",
        "Software Engineering & Cloud Architecture Sandbox"
      ],
      minorOptions: ["Artificial Intelligence & Data Science", "Cyber Security Systems", "Software Architecture"],
      careerOpportunities: [
        "AI / Deep Learning Research Engineer",
        "Distributed Cloud Architect & DevOps Lead",
        "Autonomous Robotics & Embedded Engineer",
        "Cybersecurity Defense Specialist & White Hat Analyst"
      ]
    },
    {
      id: "electrical",
      name: "Electrical & Electronic Engineering",
      code: "EE",
      color: "from-blue-500/20 to-cyan-600/30",
      accent: "#60a5fa",
      icon: "bi-lightning-charge-fill",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611.jpg",
      tagline: "Empowering Modern Smart Grids, VLSI & Next-Gen Telecom",
      overview: "Focused on clean renewable energy transitions, smart high-voltage grid stability, signal processing, VLSI microelectronics, biomedical instrumentation, and 5G/6G RF communications.",
      degree: "B.Sc. Eng (Hons) in Electrical & Electronic Engineering (4 Years)",
      keyLabs: [
        "Smart Grid, Renewable Energy & High-Voltage Lab",
        "Telecommunications, Microwave & Optical Networking Lab",
        "VLSI, Nano-electronics & Microprocessor Design Suite",
        "Power Electronics, Drives & Motion Control Lab",
        "Biomedical Engineering Electronics Research Center (BME-REC)"
      ],
      minorOptions: ["Telecommunication Engineering", "Biomedical Engineering", "Mechatronics"],
      careerOpportunities: [
        "Smart Power Grid Systems Engineer",
        "Telecommunications & Satellite RF Specialist",
        "VLSI Chip Designer & Semiconductor Analyst",
        "Renewable Energy Systems Consultant"
      ]
    },
    {
      id: "mechanical",
      name: "Mechanical Engineering",
      code: "ME",
      color: "from-rose-500/20 to-red-600/30",
      accent: "#f43f5e",
      icon: "bi-gear-wide-connected",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Mechanical-Engineering-Building.jpg",
      tagline: "Engineering Precision Machines, Thermo-Fluids & Smart Automation",
      overview: "The Department of Mechanical Engineering prepares world-class engineers specializing in dynamics, CAD/CAM prototyping, thermal energy systems, manufacturing automation, and mechatronic systems.",
      degree: "B.Sc. Eng (Hons) in Mechanical Engineering (4 Years)",
      keyLabs: [
        "CNC Machining, Additive Manufacturing & Tooling Workshop",
        "Thermodynamics, IC Engines & Heat Transfer Laboratory",
        "Fluid Dynamics & Aerodynamics Testing Tunnel",
        "Mechatronics, Industrial Automation & PLC Lab",
        "Materials Science, Metallurgy & Fracture Mechanics Lab"
      ],
      minorOptions: ["Manufacturing Engineering", "Mechatronics Engineering", "Automotive Dynamics"],
      careerOpportunities: [
        "Robotics & Automation Specialist",
        "Aerospace & Automotive Systems Designer",
        "Thermal Power Plant & Energy Consultant",
        "Precision Prototyping & Manufacturing Manager"
      ]
    },
    {
      id: "interdisciplinary",
      name: "Interdisciplinary Studies",
      code: "IS",
      color: "from-emerald-500/20 to-teal-600/30",
      accent: "#34d399",
      icon: "bi-diagram-3-fill",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-1-1.jpg",
      tagline: "Fusing Foundational Mathematics, Management & Tech Leadership",
      overview: "Functions as the intellectual cornerstone of the Faculty, delivering rigorous mathematics, computational modeling, engineering management, entrepreneurship, professional ethics, and environmental law.",
      degree: "Academic Cornerstone supporting all B.Sc. Eng (Hons) streams",
      keyLabs: [
        "Computational Mathematics & Numerical Simulation Lab",
        "Technological Innovation & Startup Hatchery",
        "Language & Professional Communication Studio",
        "Engineering Management Simulation Room"
      ],
      minorOptions: ["Engineering Management", "Entrepreneurship & Technology Commercialization"],
      careerOpportunities: [
        "Engineering Project Executive",
        "Operations Research Analyst",
        "Technical Director & Corporate Strategist",
        "Technology Entrepreneur & Innovation Leader"
      ]
    }
  ],

  // -------------------------------------------------------------------------
  // FACILITIES (ALL-IN-ONE EXPLORER)
  // Categorized for instant filtering and deep modal inspection
  // -------------------------------------------------------------------------
  facilities: [
    {
      id: "fac-library",
      title: "Faculty Central Library & E-Scholar Lounge",
      category: "library",
      categoryName: "Library & Research",
      dept: "All Faculty",
      badge: "Fully Air-Conditioned",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-2.jpg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-2.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-1-1.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-4-1.jpg"
      ],
      shortDesc: "Comprehensive engineering repository with silent zones, collaborative pods, and access to IEEE & ScienceDirect.",
      fullDesc: "The Faculty of Engineering Central Library serves as the academic nerve center. Featuring thousands of hardbound engineering reference treatises, international journals, digital workstations, and Scholar Bank access. Designed with sound-dampening acoustic glass walls, natural lighting, and high-speed Wi-Fi.",
      location: "Central Academic Complex, Level 1 & 2",
      hours: "Mon - Fri: 8:00 AM - 7:00 PM | Sat: 8:30 AM - 4:30 PM",
      features: [
        "Over 15,000+ specialized engineering volumes & handbooks",
        "Full digital access to IEEE Xplore, ScienceDirect, and Scopus",
        "Group discussion breakout cubes & multimedia presentation pods",
        "Automated RFID borrowing kiosks and self-checkout terminals"
      ],
      inCharge: "Senior Assistant Librarian, FOE",
      contactEmail: "library@eng.sjp.ac.lk"
    },
    {
      id: "fac-itc",
      title: "Centre for Information Technology Services (ITC)",
      category: "digital",
      categoryName: "Digital & IT",
      dept: "All Faculty",
      badge: "Gigabit Network",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/Image_u9f30vu9f30vu9f3.png"
      ],
      shortDesc: "High-speed campus network nerve center, enterprise server cluster, and student workstation terminal.",
      fullDesc: "The IT Centre powers high-speed fiber connectivity, student Wi-Fi access points across all lecture rooms and host complexes, secure VPNs, cloud identity services, and manages server farms hosting the LMS and MIS systems.",
      location: "Block B, Ground Floor",
      hours: "Mon - Sat: 8:00 AM - 6:00 PM (Server Monitoring 24/7)",
      features: [
        "Redundant 10Gbps fiber optic backbone across faculty buildings",
        "Full campus Wi-Fi 6 coverage for laptops and mobile devices",
        "High-performance cloud virtualization cluster for student computing",
        "Hardware repair & software licensing support desk (MATLAB, SolidWorks, Autodesk)"
      ],
      inCharge: "Director, Centre for IT Services",
      contactEmail: "itc@foe.sjp.ac.lk"
    },
    {
      id: "fac-ai-lab",
      title: "AI, Machine Learning & Robotics Lab",
      category: "labs",
      categoryName: "Specialized Labs",
      dept: "Computer Engineering",
      badge: "National Gold Award Hub",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/FOE-Win-Gold-at-National-AI-Awards-2026-1-scaled.jpg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/FOE-Win-Gold-at-National-AI-Awards-2026-1-scaled.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/MicroMaze-3.0-6.jpeg"
      ],
      shortDesc: "Equipped with NVIDIA tensor-core GPU rigs, autonomous robot platforms, edge vision rigs, and drone testbeds.",
      fullDesc: "Home to the teams that won Gold at the National AI Awards 2026 and podium at MicroMaze 3.0! This cutting-edge lab hosts specialized hardware for training convolutional neural networks, transformer models, ROS-based mobile robots, and autonomous drone swarms.",
      location: "Computer Engineering Complex, Level 3",
      hours: "Open 24/7 for Senior Project Teams and Researchers",
      features: [
        "NVIDIA RTX GPU clusters for deep learning and LLM fine-tuning",
        "MicroMaze autonomous maze-solver test arenas and timing systems",
        "Stereoscopic vision cameras, LiDAR sensors, and edge TPU boards",
        "Full robotic arm kits with 6-DOF inverse kinematics control"
      ],
      inCharge: "Lab In-Charge, Department of Computer Engineering",
      contactEmail: "comp.ai@eng.sjp.ac.lk"
    },
    {
      id: "fac-structures-lab",
      title: "Heavy Structures & Geotechnical Testing Complex",
      category: "labs",
      categoryName: "Specialized Labs",
      dept: "Civil Engineering",
      badge: "Heavy Testing Facility",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Civil-Engineering-Building.jpg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Civil-Engineering-Building.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611.jpg"
      ],
      shortDesc: "State-of-the-art hydraulic actuators, universal compression testers, and soil dynamics triaxial apparatus.",
      fullDesc: "Equipped for large-scale structural verification and destructive testing of reinforced concrete beams, prestressed steel sections, and composite structural materials. Plays a pivotal role in national infrastructure consulting.",
      location: "Civil Engineering Heavy Laboratories Block, Ground Level",
      hours: "Mon - Fri: 8:30 AM - 5:30 PM",
      features: [
        "1000 kN Computer-controlled Universal Testing Machine (UTM)",
        "Automated Triaxial and Direct Shear testing machines for soil mechanics",
        "Non-destructive ultrasonic pulse velocity & rebound hammer testkits",
        "Concrete batching plant and controlled humidity curing tanks"
      ],
      inCharge: "Head, Structural Division, CE",
      contactEmail: "civil.structures@eng.sjp.ac.lk"
    },
    {
      id: "fac-cnc-workshop",
      title: "Precision CNC Machining & Fabrication Center",
      category: "labs",
      categoryName: "Specialized Labs",
      dept: "Mechanical Engineering",
      badge: "Industry 4.0 Standard",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Mechanical-Engineering-Building.jpg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Mechanical-Engineering-Building.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135416571.jpg"
      ],
      shortDesc: "Multi-axis CNC mills, industrial lathe centers, TIG/MIG welding booths, and high-precision 3D resin printers.",
      fullDesc: "Provides undergraduates with hands-on exposure to computer-aided manufacturing (CAM), rapid prototyping, sheet metal fabrication, and metallurgy. Students turn SolidWorks CAD designs into physical precision mechanisms.",
      location: "Mechanical Engineering Workshop Bay",
      hours: "Mon - Fri: 8:00 AM - 5:00 PM",
      features: [
        "4-Axis CNC Vertical Machining Center with digital tool offset",
        "Industrial precision lathes, shaping machines, and surface grinders",
        "Laser cutting and selective additive manufacturing 3D print array",
        "Certified safety exhaust ventilation & robotic welding stations"
      ],
      inCharge: "Workshop Superintendent, Mechanical Engineering",
      contactEmail: "mech.workshop@eng.sjp.ac.lk"
    },
    {
      id: "fac-power-grid",
      title: "Smart Power Grid & Renewable Energy Hub",
      category: "labs",
      categoryName: "Specialized Labs",
      dept: "Electrical & Electronic Engineering",
      badge: "Smart Grid Ready",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/IMG_4366-Nimantha-Madhushan-scaled.jpeg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/IMG_4366-Nimantha-Madhushan-scaled.jpeg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611.jpg"
      ],
      shortDesc: "Solar microgrid simulators, high-voltage test rigs, and power system protection benches.",
      fullDesc: "Designed for advanced investigations into green energy integration, battery energy storage systems (BESS), and SCADA electrical network automations. Conducts seminars with international power sector bodies.",
      location: "Electrical Engineering Tower, Level 2",
      hours: "Mon - Fri: 8:30 AM - 5:30 PM",
      features: [
        "Rooftop solar microgrid connected to laboratory load emulators",
        "Digital protection relay benches & transmission line modelers",
        "High voltage AC/DC breakdown and insulation measurement suites",
        "MATLAB Simulink and DigSILENT PowerFactory simulation nodes"
      ],
      inCharge: "Power Systems Coordinator, EE",
      contactEmail: "ee.power@eng.sjp.ac.lk"
    },
    {
      id: "fac-medical",
      title: "Faculty Health & Medical Care Unit",
      category: "welfare",
      categoryName: "Student Welfare",
      dept: "All Faculty",
      badge: "Free for Students",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fjg1tafjg1tafjg1.png",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fjg1tafjg1tafjg1.png"
      ],
      shortDesc: "Dedicated outpatient clinic providing medical consultations, emergency first aid, and student health monitoring.",
      fullDesc: "Provides healthcare services for both undergraduates and university staff members. Supported by certified medical officers and nursing staff, equipped with vital monitoring equipment, emergency stabilization, and medical certificate validation.",
      location: "Student Services Wing, Mattegoda Complex",
      hours: "Mon - Fri: 8:30 AM - 4:30 PM (Emergency on-call 24/7)",
      features: [
        "Free doctor consultations and essential pharmaceutical dispensaries",
        "Emergency first aid, cardiac defibrillators, and vitals monitoring",
        "Periodic student mental wellness & counseling clinics",
        "Dedicated emergency ambulance linkage with regional hospital"
      ],
      inCharge: "Chief Medical Officer, University of Sri Jayewardenepura",
      contactEmail: "medical@eng.sjp.ac.lk"
    },
    {
      id: "fac-hostel",
      title: "Mattegoda Residential Halls & Quarters",
      category: "welfare",
      categoryName: "Student Welfare",
      dept: "All Faculty",
      badge: "High Security & Wi-Fi",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fr76qifr76qifr76.png",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fr76qifr76qifr76.png"
      ],
      shortDesc: "Comfortable residential hostels for engineering scholars with recreation rooms, study lounges, and dining areas.",
      fullDesc: "Situated adjacent to the faculty grounds, providing safe, vibrant accommodations with round-the-clock security, high-speed Wi-Fi, study lounges, laundry amenities, and student common spaces.",
      location: "Polgasowita Road, Mattegoda",
      hours: "Residential 24/7 Access (Curfew policies apply)",
      features: [
        "Furnished student dormitories with dedicated personal study desks",
        "Wi-Fi connectivity linked directly to university intranet",
        "Common recreation lounges with table tennis, TV, and board games",
        "Student mess hall offering subsidized healthy culinary options"
      ],
      inCharge: "Senior Student Counselor & Hostel Wardens",
      contactEmail: "hostels@eng.sjp.ac.lk"
    },
    {
      id: "fac-sports",
      title: "Faculty Sports & Recreation Arena",
      category: "welfare",
      categoryName: "Student Welfare",
      dept: "All Faculty",
      badge: "Active Campus",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/International-Study-Scholarship-Program-Announcement-Education-Instagram-Post-2-768x768-1.jpg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/International-Study-Scholarship-Program-Announcement-Education-Instagram-Post-2-768x768-1.jpg"
      ],
      shortDesc: "Fitness gymnasium, badminton courts, basketball pavilion, and cricket training grounds.",
      fullDesc: "Encouraging a well-balanced university life where engineering problem-solving meets athletic performance. Home to the Engineering Faculty cricket, rugby, badminton, and track teams competing in inter-faculty championships.",
      location: "Mattegoda Sports Pavilion",
      hours: "Daily: 6:00 AM - 8:30 PM",
      features: [
        "Indoor multi-court arena for badminton, volleyball, and basketball",
        "Modern gym equipped with weight training & cardiovascular machines",
        "Floodlit practice nets for cricket and open athletic grounds",
        "Locker rooms, shower facilities, and tournament seating"
      ],
      inCharge: "Physical Education Department FOE Coordinator",
      contactEmail: "sports@eng.sjp.ac.lk"
    },
    {
      id: "fac-rcfe",
      title: "Research Centre for Faculty of Engineering (RCFE)",
      category: "research",
      categoryName: "Research Centers",
      dept: "All Faculty",
      badge: "Innovation Hub",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/test24.jpg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/test24.jpg"
      ],
      shortDesc: "Multidisciplinary research nexus fostering patents, industry collaborations, and postgraduate M.Phil / Ph.D. research.",
      fullDesc: "RCFE spearheads national technology transfers, sustainability initiatives, and high-impact publications. Hosts research symposiums, patent incubation desks, and industry roundtables.",
      location: "Block A, Level 3",
      hours: "Mon - Fri: 8:30 AM - 5:00 PM",
      features: [
        "Competitive internal grant management for innovative student projects",
        "Industry-sponsored R&D matching and commercialization incubation",
        "Organizing body of ConTRE (Conference on Technology and Research)",
        "Postgraduate research scholar workstations and publication repository"
      ],
      inCharge: "Director, RCFE",
      contactEmail: "rcfe@eng.sjp.ac.lk"
    }
  ],

  // -------------------------------------------------------------------------
  // LATEST NEWS & MILESTONES
  // Real verified items from eng.sjp.ac.lk
  // -------------------------------------------------------------------------
  news: [
    {
      id: "news-1",
      title: "Faculty of Engineering Students Secure Second Runners-Up at MicroMaze 3.0",
      date: "October 8, 2026",
      category: "Student Achievement",
      badge: "Robotics Award",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/MicroMaze-3.0-6.jpeg",
      excerpt: "Demonstrating phenomenal algorithmic acumen and hardware precision, FOE USJ undergraduates clinch podium victory in the island's premier micro-mouse competition.",
      link: "https://eng.sjp.ac.lk/blog/2026/10/08/faculty-of-engineering-students-secure-second-runners-up-at-micromaze-3-0/"
    },
    {
      id: "news-2",
      title: "Faculty Recognized at NBQSA National ICT Awards 2026",
      date: "October 5, 2026",
      category: "National Recognition",
      badge: "ICT Excellence",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/PXL_20260925_1527478083.jpg",
      excerpt: "University of Sri Jayewardenepura engineering innovations gain high honors at the prestigious National Best Quality Software Awards 2026.",
      link: "https://eng.sjp.ac.lk/blog/2026/10/05/faculty-of-engineering-university-of-sri-jayewardenepura-recognized-at-nbqsa-national-ict-awards-2026/"
    },
    {
      id: "news-3",
      title: "Engineering Students Win Gold at National AI Awards 2026",
      date: "October 4, 2026",
      category: "AI Innovation",
      badge: "Gold Award",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/FOE-Win-Gold-at-National-AI-Awards-2026-1-scaled.jpg",
      excerpt: "Deep learning system engineered by Computer Engineering undergraduates wins Gold at the National Artificial Intelligence competition.",
      link: "https://eng.sjp.ac.lk/blog/2026/10/04/faculty-of-engineering-students-win-gold-at-national-ai-awards-2026/"
    },
    {
      id: "news-4",
      title: "Making Sri Lanka Proud on the Global Stage - Windhula Gammanpila",
      date: "September 22, 2026",
      category: "Global Impact",
      badge: "International",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/Windhula-Gammanpila.jpg",
      excerpt: "Undergraduate Windhula Gammanpila represents the Faculty of Engineering and Sri Lanka with remarkable distinction on the international research stage.",
      link: "https://eng.sjp.ac.lk/blog/2026/09/22/making-sri-lanka-proud-on-the-global-stage/"
    },
    {
      id: "news-5",
      title: "Seminar on Power Grid Construction & Management for SCO Countries",
      date: "September 14, 2026",
      category: "Global Collaboration",
      badge: "Power Engineering",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/IMG_4366-Nimantha-Madhushan-scaled.jpeg",
      excerpt: "Faculty delegates participate in international cross-border smart grid transmission seminars with leading energy researchers.",
      link: "https://eng.sjp.ac.lk/blog/2026/09/14/seminar-on-power-grid-construction-and-management-for-shanghai-cooperation-organization-countries/"
    }
  ],

  // -------------------------------------------------------------------------
  // FACULTY INTERACTIVE MAP BLOCKS & ZONES
  // Interactive hotspot coordinates for the Mattegoda Permanent Complex
  // -------------------------------------------------------------------------
  mapZones: [
    {
      id: "zone-admin",
      name: "Administration & Dean's Secretariat Block",
      shortName: "Administration Block",
      code: "ADMIN",
      x: 18,
      y: 30,
      type: "admin",
      category: "administrative",
      icon: "bi-building-fill",
      accent: "#f59e0b",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg",
      hours: "Mon - Fri: 8:00 AM - 5:00 PM",
      desc: "Dean's Secretariat, Senior Assistant Registrar (SAR), Assistant Bursar, Student Affairs division, Examination Branch, and Faculty Boardroom.",
      tag: "Administration & Governance",
      highlights: ["Dean's Office", "Student Affairs & SAR", "Finance & Bursar", "Boardroom"],
      floors: [
        { level: "Ground Floor", desc: "SAR Office, Examination Inquiries & Student Services" },
        { level: "Level 1", desc: "Dean's Secretariat & Executive Faculty Boardroom" },
        { level: "Level 2", desc: "Finance & Accounts Branch, Bursar & Administration" }
      ]
    },
    {
      id: "zone-auditorium",
      name: "Main Faculty Auditorium Block",
      shortName: "Auditorium Block",
      code: "AUD",
      x: 36,
      y: 22,
      type: "auditorium",
      category: "academic",
      icon: "bi-display-fill",
      accent: "#ec4899",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg",
      hours: "Event Specific / 8:00 AM - 7:00 PM",
      desc: "500+ seat acoustic auditorium equipped for international symposiums, research conferences, guest lectures, and faculty cultural ceremonies.",
      tag: "Conferences & Ceremonies",
      highlights: ["500+ Seating", "Acoustic Audio-Visual", "Stage Rigging", "Conference Suite"],
      floors: [
        { level: "Main Hall", desc: "500-Seat Tiered Auditorium with High-End Stage Audio & Lighting" },
        { level: "Mezzanine", desc: "Audio-Visual Production Control Booth & Guest VIP Lounge" }
      ]
    },
    {
      id: "zone-civil",
      name: "Department of Civil Engineering Block",
      shortName: "Civil Engineering Block",
      code: "CE",
      x: 56,
      y: 20,
      type: "civil",
      category: "department",
      icon: "bi-cone-striped",
      accent: "#f59e0b",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Civil-Engineering-Building.jpg",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM",
      desc: "Heavy structures testing bay, 20m wave flume hydraulics lab, geotechnical testing suites, and environmental water quality bay.",
      tag: "Department Block",
      highlights: ["Structural Testing Bay", "Hydraulics Flume", "Geotechnical Lab", "Pavement Testing"],
      floors: [
        { level: "Ground Level", desc: "Heavy Structural Mechanics Bay & 1000 kN Universal Testing Machine" },
        { level: "Level 1", desc: "20m Wave Flume Fluid Mechanics & Hydraulics Suite" },
        { level: "Level 2", desc: "Soil Mechanics, Geology & Geotechnical Testing Chambers" },
        { level: "Level 3", desc: "Environmental Engineering & Water Quality Laboratory" }
      ]
    },
    {
      id: "zone-mech",
      name: "Department of Mechanical Engineering Block",
      shortName: "Mechanical Engineering Block",
      code: "ME",
      x: 78,
      y: 22,
      type: "mechanical",
      category: "department",
      icon: "bi-gear-wide-connected",
      accent: "#f97316",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Mechanical-Engineering-Building.jpg",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM",
      desc: "Industrial workshops, CNC precision machining centre, IC engines dynamometer, wind tunnel aerodynamics bay, and robotics fabrication.",
      tag: "Department Block",
      highlights: ["CNC & Fabrication Bay", "IC Engine Dynamometer", "Wind Tunnel Lab", "Automotive Bay"],
      floors: [
        { level: "Ground Level", desc: "CNC Machining Center, Industrial Lathes, Millers & Welding Bays" },
        { level: "Level 1", desc: "IC Engine Dynamometer, Thermodynamics & Aerodynamics Tunnel" },
        { level: "Level 2", desc: "Mechatronics, Industrial PLC Automation & Robotics Lab" }
      ]
    },
    {
      id: "zone-computer",
      name: "Department of Computer Engineering Block",
      shortName: "Computer Engineering Block",
      code: "CO",
      x: 66,
      y: 44,
      type: "computer",
      category: "department",
      icon: "bi-cpu-fill",
      accent: "#38bdf8",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611-1.jpg",
      hours: "Mon - Sat: 8:00 AM - 8:00 PM (Research 24/7)",
      desc: "AI & Machine Learning Innovation Lab, High-Performance GPU Cluster, Embedded IoT Suites, Computer Networks, and Cloud Systems centre.",
      tag: "Department Block",
      highlights: ["AI & ML Innovation Lab", "HPC GPU Cluster", "Robotics & IoT Suites", "Cybersecurity Bay"],
      floors: [
        { level: "Level 1", desc: "Software Architecture Sandbox & Network Security Lab" },
        { level: "Level 2", desc: "Embedded IoT Systems & Autonomous Mobile Robotics Arena" },
        { level: "Level 3", desc: "NVIDIA Tensor GPU AI/Deep Learning Research Hub" }
      ]
    },
    {
      id: "zone-electrical",
      name: "Department of Electrical & Electronic Engineering Block",
      shortName: "Electrical Engineering Block",
      code: "EE",
      x: 86,
      y: 44,
      type: "electrical",
      category: "department",
      icon: "bi-lightning-charge-fill",
      accent: "#eab308",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250309_1219023342-1.jpg",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM",
      desc: "High-voltage testing bay, smart grid simulator, power electronics suites, telecommunications microwave RF lab, and VLSI microchip design.",
      tag: "Department Block",
      highlights: ["High Voltage Bay", "Smart Grid Simulator", "Telecommunications Lab", "Power Electronics"],
      floors: [
        { level: "Ground Level", desc: "High-Voltage Testing Chamber & AC/DC Breakdown Suite" },
        { level: "Level 1", desc: "Smart Power Microgrid Simulator & SCADA Control Station" },
        { level: "Level 2", desc: "VLSI Microelectronics, Telecommunications & Microwave Lab" }
      ]
    },
    {
      id: "zone-is",
      name: "Department of Interdisciplinary Studies Block",
      shortName: "Interdisciplinary Studies Block",
      code: "DIS",
      x: 48,
      y: 40,
      type: "interdisciplinary",
      category: "department",
      icon: "bi-diagram-3-fill",
      accent: "#a855f7",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-1-1.jpg",
      hours: "Mon - Fri: 8:30 AM - 5:00 PM",
      desc: "Engineering mathematics, management sciences, computational social research, humanities, economics, and business innovation incubation.",
      tag: "Department Block",
      highlights: ["Engineering Mathematics", "Management & Finance", "Computational Suite", "Innovation Cell"],
      floors: [
        { level: "Level 1", desc: "Computational Mathematics & Statistical Modeling Studio" },
        { level: "Level 2", desc: "Engineering Management & Entrepreneurship Innovation Hatchery" }
      ]
    },
    {
      id: "zone-library",
      name: "Central Engineering Library Block",
      shortName: "Central Library Block",
      code: "LIB",
      x: 30,
      y: 46,
      type: "library",
      category: "academic",
      icon: "bi-journal-bookmark-fill",
      accent: "#06b6d4",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-2.jpg",
      hours: "Mon - Fri: 8:00 AM - 7:00 PM | Sat: 8:30 AM - 4:30 PM",
      desc: "Two-floor modern library with silent study cubicles, IEEE/Springer digital repository terminal rooms, and scholar collaborative group pods.",
      tag: "Academic Hub",
      highlights: ["Digital Catalogs", "IEEE Electronic Vault", "Quiet Study Zone", "Group Discussion Pods"],
      floors: [
        { level: "Level 1", desc: "Main Reference Stacks, Circulation Desk & Automated RFID Kiosk" },
        { level: "Level 2", desc: "Silent E-Scholar Lounge, Digital Journal Pods & Discussion Cubes" }
      ]
    },
    {
      id: "zone-research",
      name: "Research Centre for Faculty of Engineering (RCFE)",
      shortName: "Research Centre Block",
      code: "RCFE",
      x: 14,
      y: 56,
      type: "research",
      category: "academic",
      icon: "bi-stars",
      accent: "#ec4899",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/test24.jpg",
      hours: "Mon - Fri: 8:30 AM - 5:30 PM",
      desc: "Multidisciplinary postgraduate research labs, Biomedical Engineering Research Centre (BME-REC), and patent incubation facilities.",
      tag: "Advanced Research",
      highlights: ["BME-REC Facility", "Postgrad Research Bay", "Tech Incubator", "Patent Office"],
      floors: [
        { level: "Level 1", desc: "Patent Commercialization Office & Industry Partner Desks" },
        { level: "Level 2", desc: "Biomedical Engineering Electronics Research Center (BME-REC)" }
      ]
    },
    {
      id: "zone-scr",
      name: "Main Student Common Room (SCR)",
      shortName: "Student Common Room Block",
      code: "SCR",
      x: 26,
      y: 68,
      type: "scr",
      category: "recreation",
      icon: "bi-people-fill",
      accent: "#10b981",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fr76qifr76qifr76.png",
      hours: "Daily: 7:00 AM - 9:00 PM",
      desc: "Spacious recreation and relaxation lounge for engineering students featuring indoor games (carrom, chess), lounge chairs, and student society desk.",
      tag: "Student Recreation",
      highlights: ["Indoor Games", "Student Union Desk", "Discussion Area", "Relaxation Lounge"],
      floors: [
        { level: "Ground Level", desc: "Recreation Hall, Carrom/Chess Arenas & Student Society Desks" }
      ]
    },
    {
      id: "zone-theatre",
      name: "Open-Air Outdoor Theatre & Amphitheatre",
      shortName: "Outdoor Theatre Block",
      code: "THEATRE",
      x: 46,
      y: 64,
      type: "theatre",
      category: "recreation",
      icon: "bi-music-note-beamed",
      accent: "#8b5cf6",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg",
      hours: "Open Campus Access",
      desc: "Tiered green lawn amphitheatre for faculty cultural performances, acoustic music fests, drama showcases, and student club assemblies.",
      tag: "Cultural & Performing Arts",
      highlights: ["Tiered Lawn Seating", "Outdoor Acoustics", "Open-Air Stage", "Student Events"],
      floors: [
        { level: "Outdoor", desc: "Tiered Lawn Amphitheatre for Cultural Performances & Assemblies" }
      ]
    },
    {
      id: "zone-canteen",
      name: "Main Student Canteen Block",
      shortName: "Main Student Canteen",
      code: "CANTEEN",
      x: 66,
      y: 66,
      type: "canteen",
      category: "dining",
      icon: "bi-cup-hot-fill",
      accent: "#f59e0b",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fr76qifr76qifr76.png",
      hours: "Daily: 6:30 AM - 7:30 PM",
      desc: "Spacious subsidized main cafeteria serving hygienic daily meals, breakfast, lunch, fresh short-eats, tea, and beverages for all undergraduates.",
      tag: "Student Dining",
      highlights: ["Daily Subsidized Meals", "Beverage & Tea Bar", "Spacious Seating", "Hygienic Kitchen"],
      floors: [
        { level: "Ground Level", desc: "Main Dining Hall, Subsidized Meal Counters & Fresh Beverage Bar" }
      ]
    },
    {
      id: "zone-foodcourt",
      name: "Faculty Food Court & Multi-Cuisine Pavilion",
      shortName: "Food Court Block",
      code: "FOODCOURT",
      x: 85,
      y: 66,
      type: "food-court",
      category: "dining",
      icon: "bi-shop",
      accent: "#ef4444",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fjg1tafjg1tafjg1.png",
      hours: "Daily: 7:30 AM - 8:00 PM",
      desc: "Modern multi-vendor food court featuring fresh juice bar, snacks corner, bakery counter, ice-cream, and outdoor shaded dining patio.",
      tag: "Food Court & Dining",
      highlights: ["Multi-Vendor Stalls", "Fresh Juice Bar", "Bakery & Espresso", "Outdoor Terrace"],
      floors: [
        { level: "Pavilion", desc: "Multi-Cuisine Stalls, Fresh Juice Bar, Bakery Counter & Shaded Patio" }
      ]
    },
    {
      id: "zone-medical",
      name: "Faculty Health & Medical Centre Block",
      shortName: "Medical Centre Block",
      code: "MED",
      x: 18,
      y: 84,
      type: "medical",
      category: "welfare",
      icon: "bi-heart-pulse-fill",
      accent: "#f43f5e",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fjg1tafjg1tafjg1.png",
      hours: "Mon - Fri: 8:30 AM - 4:30 PM (24/7 On-Call Emergency)",
      desc: "Resident university medical officer consultation, emergency treatment bay, free medication dispensary, and student counselling consultation.",
      tag: "Health & Wellness",
      highlights: ["Doctor Consultation", "Emergency Bay", "Dispensary", "Student Counselling"],
      floors: [
        { level: "Ground Level", desc: "Doctor Consultation Rooms, Observation Beds & Free Pharmacy" }
      ]
    },
    {
      id: "zone-gym",
      name: "Faculty Gymnasium & Fitness Centre",
      shortName: "Gymnasium Block",
      code: "GYM",
      x: 68,
      y: 86,
      type: "gym",
      category: "sports",
      icon: "bi-activity",
      accent: "#10b981",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/International-Study-Scholarship-Program-Announcement-Education-Instagram-Post-2-768x768-1.jpg",
      hours: "Daily: 6:00 AM - 8:30 PM",
      desc: "Comprehensive weight training arena, cardio equipment, stationary bikes, multi-gym stations, and table tennis facilities with qualified sports trainers.",
      tag: "Sports & Fitness",
      highlights: ["Strength Training Bay", "Cardio Zone", "Table Tennis Courts", "Locker Rooms"],
      floors: [
        { level: "Ground Floor", desc: "Cardio Zone, Multi-Gym Stations, Free Weights & Indoor Badminton" }
      ]
    },
    {
      id: "zone-gym-canteen",
      name: "Gym Canteen & Sports Refreshment Bar",
      shortName: "Gym Canteen Block",
      code: "GYM-CAFE",
      x: 88,
      y: 86,
      type: "gym-canteen",
      category: "dining",
      icon: "bi-cup-straw",
      accent: "#06b6d4",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fr76qifr76qifr76.png",
      hours: "Daily: 6:30 AM - 8:00 PM",
      desc: "Dedicated sports cafeteria adjoining the gym pavilion offering protein bars, energy shakes, freshly blended citrus juices, and post-workout snacks.",
      tag: "Sports Dining",
      highlights: ["Protein Shakes & Smoothies", "Fresh Fruit Juices", "Post-Workout Snacks", "Quick Refreshments"],
      floors: [
        { level: "Ground Level", desc: "Sports Nutrition Counter, Protein Smoothies & Energy Snacks Bar" }
      ]
    }
  ]
};

export { FOE_DATA };
export default FOE_DATA;
if (typeof window !== 'undefined') {
  window.FOE_DATA = FOE_DATA;
}
