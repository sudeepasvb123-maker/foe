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
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135416571.jpg",
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
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/01/deptee.jpg",
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
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/Lecture-Hall-L211A-New.jpg",
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
      id: "fac-cfse",
      title: "Center for Fire Safety Engineering",
      altTitle: "Center for Fire Safety Engineering (CFSE)",
      category: "research",
      categoryName: "Premier Research & Safety Bay",
      dept: "Civil & Mechanical Engineering",
      isFeatured: true,
      badge: "⭐ FEATURED • NATIONAL TESTING CENTER",
      featuredTag: "🔥 National Center for Fire Safety Engineering",
      accentGlow: "fire",
      image: "33fire.jpg",
      gallery: [
        {
          url: "33fire.jpg",
          title: "Center for Fire Safety Engineering (CFSE)",
          desc: "Iconic exterior of the specialized Fire Safety Engineering building and high-temperature testing tower at Mattegoda"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611.jpg",
          title: "Combustion & Flammability Testing Apparatus",
          desc: "Cone calorimeter and thermal degradation measurement rigs"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg",
          title: "Computational Fire Dynamics & CFD Simulation Lab",
          desc: "64-Core high-performance cluster running FDS and Pyrosim evacuation models"
        }
      ],
      shortDesc: "Pioneering national research and testing facility dedicated to structural fire resistance, building flammability, smoke dynamics, and human evacuation engineering.",
      fullDesc: "The Center for Fire Safety Engineering (CFSE) at the University of Sri Jayewardenepura is Sri Lanka's pioneering academic and consulting authority on fire safety engineering. The facility is equipped with specialized instrumentation for testing the structural fire endurance of reinforced concrete and steel members under furnace temperatures exceeding 1200°C, assessing the heat release rate of construction composites via cone calorimetry, modeling toxic smoke spread in complex atriums, and simulating occupant evacuation flow. CFSE collaborates closely with the Institution of Fire Engineers (UK), municipal fire brigades, and urban development regulators to formulate national building fire codes and conduct high-level forensic investigations.",
      location: "CFSE Dedicated Bay, Heavy Structures Complex, Mattegoda",
      hours: "Mon - Fri: 8:00 AM - 5:00 PM (Emergency Incident Analysis On-Call)",
      features: [
        "Full-scale structural fire testing furnace conforming to ISO 834, BS 476 & ASTM E119",
        "Cone calorimeter apparatus for heat release rate (HRR), mass loss, and smoke generation",
        "High-performance 64-core cluster running Fire Dynamics Simulator (FDS) & Smokeview",
        "Human egress & crowd evacuation simulation workstations for high-rise buildings",
        "Flame retardancy assessment for facade claddings, timber, polymer composites, and cables",
        "Professional development and accredited safety certifications for building services engineers"
      ],
      specs: [
        { label: "Furnace Capacity", value: "Up to 1200°C standard time-temperature curve" },
        { label: "Standard Compliance", value: "ISO 834, BS 476, ASTM E119, NFPA 101" },
        { label: "Simulation Power", value: "64-Core GPU/CPU CFD Fire Simulation Cluster" },
        { label: "National Mandate", value: "National fire audit, forensic analysis & code development" }
      ],
      inCharge: "Director, Center for Fire Safety Engineering (CFSE)",
      contactEmail: "cfse@eng.sjp.ac.lk"
    },
    {
      id: "fac-auditorium",
      title: "Full functioned auditorium",
      altTitle: "Full-Functioned Faculty Auditorium & Performing Arts Complex",
      category: "welfare",
      categoryName: "Grand Convention & Arts Arena",
      dept: "Faculty of Engineering",
      isFeatured: true,
      badge: "⭐ FEATURED • 650-SEAT AUDITORIUM",
      featuredTag: "🎭 650-Seat Acoustic Theater & Grand Convention Hall",
      accentGlow: "auditorium",
      image: "11audi.jpg",
      gallery: [
        {
          url: "11audi.jpg",
          title: "Main Grand Auditorium Interior & Seating",
          desc: "Iconic panoramic view of the 650-seat acoustic tiered auditorium, proscenium arch, and proscenium stage"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/Auditorium-2.jpeg",
          title: "Tiered Seating Gallery & Acoustic Timber Panels",
          desc: "Sound-absorbing diffuser timber paneling engineered for optimal speech and musical resonance (RT60 = 1.1s)"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg",
          title: "Auditorium & Academic Complex Concourse",
          desc: "Mattegoda complex main entrance and auditorium access concourse"
        }
      ],
      shortDesc: "650-seat premier theater and convention complex featuring line-array surround sound, 4K digital laser projection, motorized stage lighting, and VIP production suites.",
      fullDesc: "The Faculty Auditorium is a flagship 650-seat multifunctional theater and convention hall engineered to international acoustic standards. Designed to host university convocations, international research symposiums (such as ConTRE 2026), inaugural ceremonies, industry keynote summits, dramatic performances, and cultural galas. The hall is equipped with a digital Dante sound network powering JBL line-array speakers, automated stage curtains, a 4K 15,000-lumens panoramic laser projection system, multi-channel DMX stage lighting, central climate control, and digital broadcast suites for live international streaming.",
      location: "Central Academic Block, Ground Level",
      hours: "Available for Academic Conferences, Guest Lectures, Cultural Events & Ceremonies",
      features: [
        "650 cushioned theater seats with stepped sightlines, ergonomic armrests, and VIP mezzanine",
        "JBL Line-Array concert sound system with Yamaha 32-channel digital mixing desk",
        "4K Ultra-HD laser projection system with motorized 240-inch cinematic projection screen",
        "Computerized stage lighting grid with motorized moving heads, follow spots, and DMX dimmers",
        "Backstage VIP green rooms, dressing suites, rehearsal lounges, and guest reception lobbies",
        "Multi-camera 4K broadcast recording and live streaming studio for global webinars"
      ],
      specs: [
        { label: "Seating Capacity", value: "650 Tiered Theater Seats (inclusive of VIP Box)" },
        { label: "Acoustic Metric", value: "Reverberation time RT60 = 1.1s with timber diffusers" },
        { label: "Audio Architecture", value: "Yamaha Dante Digital Audio Network & Line-Array" },
        { label: "Video & Projection", value: "4K Laser 15,000 Lumens & Dual Confidence Monitors" }
      ],
      inCharge: "Auditorium & Events Committee, Faculty of Engineering",
      contactEmail: "auditorium@eng.sjp.ac.lk"
    },
    {
      id: "fac-library",
      title: "Faculty Central Library & E-Scholar Lounge",
      category: "library",
      categoryName: "Library & Research",
      dept: "All Faculty",
      badge: "Fully Air-Conditioned",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-1-1.jpg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-1-1.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-2.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-3.jpg"
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
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/IT-Center.jpg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/IT-Center.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/IT_Lab.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Data-Centre-FOE.jpg"
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
        "https://eng.sjp.ac.lk/wp-content/uploads/2025/01/deptee.jpg"
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
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/PXL_20260925_1527478083.jpg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/PXL_20260925_1527478083.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/PXL_20260925_1527089422.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FB_IMG_1760579986985.jpg-Sanuri-Himalka.jpeg"
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
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/FOE-Win-Gold-at-National-AI-Awards-2026-1-scaled.jpg",
      gallery: [
        "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/FOE-Win-Gold-at-National-AI-Awards-2026-1-scaled.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611.jpg",
        "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135416571.jpg"
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
    },
    {
      id: "fac-theatre",
      title: "Outdoor Theatre",
      category: "welfare",
      categoryName: "Cultural & Performing Arts",
      dept: "Student Welfare & Arts Circle",
      badge: "Open-Air Amphitheatre",
      image: "22outaudi.jpg",
      gallery: [
        {
          url: "22outaudi.jpg",
          title: "Outdoor Auditorium & Amphitheatre at Sunset",
          desc: "Iconic circular stage, tiered stone stepped seating, and reflecting water basin overlooking the golden evening horizon"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg",
          title: "Concourse Approach & Promenade",
          desc: "Central campus walkway leading directly to the amphitheatre bowl"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Civil-Engineering-Building.jpg",
          title: "Surrounding Academic Complex",
          desc: "Scenic backdrop of faculty departmental towers and green campus courtyard"
        }
      ],
      shortDesc: "A spacious open-air venue with tiered green lawn seating for student gatherings, cultural music events, and outdoor performances.",
      fullDesc: "The Outdoor Theatre serves as the cultural heart and social nexus for the Faculty of Engineering. Providing a vibrant open-air setting for musical fests, drama rehearsals, acoustic showcases, club assemblies, and graduation gatherings under the open sky. Engineered with natural bowl acoustics and surrounding landscaped vegetation, it accommodates large student audiences in an eco-friendly campus atmosphere.",
      location: "Mattegoda Open-Air Cultural Lawn",
      hours: "Daily: Open Campus Hours (Evening events scheduled via SAR)",
      features: [
        "Tiered grass amphitheatre terraces accommodating 400+ seated spectators",
        "Elevated stage platform with dedicated electrical audio distribution terminals",
        "Natural acoustic reflection bowl complemented by surrounding green tree canopy",
        "Preferred outdoor venue for faculty talent concerts, open-mic sessions & society meetings"
      ],
      specs: [
        { label: "Venue Type", value: "Open-Air Natural Lawn Amphitheatre" },
        { label: "Seating Capacity", value: "400+ Outdoor Spectators" },
        { label: "Event Host", value: "Student Union & Arts Circle" },
        { label: "Power Infrastructure", value: "Staging Power Distribution Hookups" }
      ],
      inCharge: "Senior Assistant Registrar (SAR) & Student Affairs",
      contactEmail: "sar@eng.sjp.ac.lk"
    },
    {
      id: "fac-gym",
      title: "Gymnasium",
      category: "welfare",
      categoryName: "Sports & Physical Fitness",
      dept: "Department of Physical Education & Sports",
      badge: "Modern Fitness Center",
      image: "https://lh3.googleusercontent.com/d/1hF9PiVfa6hy_pgaZlqhtxU9Wov1g2iX5",
      gallery: [
        {
          url: "https://lh3.googleusercontent.com/d/1hF9PiVfa6hy_pgaZlqhtxU9Wov1g2iX5",
          title: "Weight Training & Dumbbell Section",
          desc: "Commercial free weights, Olympic barbell stations, and multi-gym workout benches"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/PXL_20260925_1527478083.jpg",
          title: "Sports Complex Pavilion Exterior",
          desc: "Comprehensive athletic building housing fitness rooms and court facilities"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/PXL_20260925_1527089422.jpg",
          title: "Cardio & Fitness Conditioning Sector",
          desc: "Treadmills, stationary spin bikes, and cardiovascular workout units"
        }
      ],
      shortDesc: "Fully equipped modern fitness center featuring free weights, multi-gym stations, and cardio machines for students and staff.",
      fullDesc: "Equipped with modern commercial weights, Olympic lifting platforms, dumbbell racks, and cardio machines to empower the university community in maintaining athletic health. Under the guidance of certified physical fitness trainers from the Department of Physical Education, undergraduates and faculty members enjoy structured strength routines, endurance training, and athletic preparation for inter-university tournaments.",
      location: "Sports & Recreation Pavilion, Ground Floor",
      hours: "Daily: 6:00 AM - 8:30 PM (Dedicated slots for men, women & staff)",
      features: [
        "Heavy-duty Olympic power racks, flat and incline benches, and barbell suites",
        "Complete cardio zone featuring electronic treadmills, cross trainers, and spin bikes",
        "Clean, hygienic changing rooms with personal lockers and shower cubicles",
        "Qualified physical education trainers offering personal workout and fitness advice"
      ],
      specs: [
        { label: "Equipment Suite", value: "Commercial Free Weights & Multi-Gym" },
        { label: "Cardio Section", value: "Treadmills, Ellipticals & Spin Bikes" },
        { label: "Instructor Support", value: "Certified Sports Council Trainers" },
        { label: "Access Eligibility", value: "All FOE Undergraduates & Faculty Staff" }
      ],
      inCharge: "Director of Physical Education & Sports Council",
      contactEmail: "gym@eng.sjp.ac.lk"
    },
    {
      id: "fac-gym-canteen",
      title: "Gym Canteen",
      category: "dining",
      categoryName: "Sports Nutrition & Refreshments",
      dept: "Student Welfare & Recreation",
      badge: "Fitness Nutrition Bar",
      image: "gym_canteen.jpg",
      gallery: [
        {
          url: "gym_canteen.jpg",
          title: "Sports Nutrition Counter & Seating",
          desc: "Convenient snack and juice bar adjoining the gym pavilion"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fr76qifr76qifr76.png",
          title: "Dining Terrace",
          desc: "Shaded tables and quick seating for post-workout recovery"
        }
      ],
      shortDesc: "A convenient refreshment spot located right next to the gym offering healthy snacks, energy drinks, and fresh juices.",
      fullDesc: "Strategically located adjoining the gym pavilion, the Gym Canteen offers athletes and students quick, wholesome post-workout nutrition. Serving freshly squeezed seasonal fruit juices, protein-rich snacks, chilled electrolyte drinks, milk beverages, and healthy breakfast items formulated to rehydrate and replenish energy after intensive physical workouts.",
      location: "Adjoining Gymnasium Pavilion, Mattegoda",
      hours: "Daily: 6:30 AM - 8:00 PM",
      features: [
        "Fresh citrus juices, watermelon smoothies, and cold electrolyte thirst-quenchers",
        "Nutritious protein snacks, energy bars, and boiled grain varieties (kadala, mung)",
        "Quick service counter designed for athletes on their way to lectures or practice",
        "Outdoor shaded umbrella seating overlooking the sports field"
      ],
      specs: [
        { label: "Service Style", value: "Quick-Serve Healthy Refreshments" },
        { label: "Specialty", value: "Fresh Fruit Juices & Energy Nutrition" },
        { label: "Hygiene Standard", value: "PHI Certified University Food Safety" },
        { label: "Payment Options", value: "Cash & Student Digital Payments" }
      ],
      inCharge: "Welfare Officer & Canteen Management Committee",
      contactEmail: "welfare@eng.sjp.ac.lk"
    },
    {
      id: "fac-canteen",
      title: "Main Canteen",
      category: "dining",
      categoryName: "Campus Dining & Cafeteria",
      dept: "Student Welfare Division",
      badge: "Primary Dining Complex",
      image: "main_canteen.jpg",
      gallery: [
        {
          url: "main_canteen.jpg",
          title: "Main Dining Hall & Serving Line",
          desc: "Spacious cafeteria seating over 300 students for daily subsidized meals"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fjg1tafjg1tafjg1.png",
          title: "Meal Counter & Fresh Beverage Station",
          desc: "Hygienic stainless-steel serving bay and tea counter"
        }
      ],
      shortDesc: "The primary dining area offering a wide variety of meals, breakfast, lunch, and tea at student-friendly subsidized prices.",
      fullDesc: "The Main Canteen is the central dining hall of the Mattegoda campus, serving hundreds of engineering students, academic lecturers, and non-academic staff members every day. Featuring a diverse culinary spread from traditional Sri Lankan rice and curry to morning hoppers, rottis, and evening short-eats. Strict public health inspector (PHI) food safety standards ensure clean, nutritious, and affordable meals throughout the academic semester.",
      location: "Student Services Complex, Ground Level",
      hours: "Daily: 6:30 AM - 7:30 PM",
      features: [
        "Subsidized hot rice and curry for lunch and dinner with fish, chicken, and vegetarian options",
        "Fresh breakfast selections including hoppers, string hoppers, pol rotti, and tea",
        "Massive, well-ventilated dining hall with high ceilings accommodating 300+ guests",
        "Filtered, UV-sterilized potable drinking water dispensing units available for all"
      ],
      specs: [
        { label: "Dining Capacity", value: "300+ Seated Students Simultaneously" },
        { label: "Meal Subsidy", value: "University Subsidized Student Pricing" },
        { label: "Service Times", value: "Breakfast, Lunch, Evening Tea & Dinner" },
        { label: "Cleanliness", value: "Daily Sterilization & Safe Potable Water" }
      ],
      inCharge: "Canteen Management Committee & Senior Student Counselor",
      contactEmail: "canteen@eng.sjp.ac.lk"
    },
    {
      id: "fac-foodcourt",
      title: "Food Court",
      category: "dining",
      categoryName: "Multi-Cuisine Dining Pavilion",
      dept: "Student Welfare Division",
      badge: "Multi-Vendor Pavilion",
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fjg1tafjg1tafjg1.png",
      gallery: [
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fjg1tafjg1tafjg1.png",
          title: "Multi-Vendor Food Pavilion",
          desc: "Modern counters offering diverse culinary choices, bakery items, and beverages"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fr76qifr76qifr76.png",
          title: "Outdoor Shaded Dining Patio",
          desc: "Al fresco patio with umbrella tables for casual dining and student group work"
        }
      ],
      shortDesc: "A diverse culinary space featuring multiple food vendors, bakery items, espresso coffee, and shaded patio seating.",
      fullDesc: "The Faculty Food Court provides an energetic alternative dining experience with multiple independent culinary stalls. Undergraduates can choose from artisan bakery pastries, fresh juices, espresso drinks, sandwiches, and fast meals. Surrounded by a shaded garden terrace equipped with Wi-Fi, it offers a relaxed spot for study groups and casual campus meetups between lectures.",
      location: "Mattegoda Academic Walkway Promenade",
      hours: "Daily: 7:30 AM - 8:30 PM",
      features: [
        "Multi-vendor food kiosks featuring snacks, bakery delights, and custom sandwiches",
        "Dedicated beverage stall with milkshakes, ice tea, espresso, and seasonal fruit juices",
        "Shaded garden patio seating with electrical charging points and university Wi-Fi",
        "Extended evening operating hours catering to students working late in project labs"
      ],
      specs: [
        { label: "Stall Variety", value: "Bakery, Juices, Short Eats & Fast Meals" },
        { label: "Ambiance", value: "Outdoor Shaded Garden Patio & Indoor Stalls" },
        { label: "Wi-Fi Coverage", value: "Full Campus Intranet Wi-Fi Available" },
        { label: "Accessibility", value: "Central Walkway Access from all Departments" }
      ],
      inCharge: "Commercial Services Coordinator, USJ",
      contactEmail: "foodcourt@eng.sjp.ac.lk"
    },
    {
      id: "fac-kids-play",
      title: "Kids Play Area",
      category: "welfare",
      categoryName: "Staff Family & Child Welfare",
      dept: "Faculty Staff Welfare Society",
      badge: "Family Safe Zone",
      image: "kids_play_area.jpg",
      gallery: [
        {
          url: "kids_play_area.jpg",
          title: "Child-Friendly Recreation Area",
          desc: "Safe outdoor playground equipped with modern play equipment and safety turf"
        },
        {
          url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fr76qifr76qifr76.png",
          title: "Adjoining Staff Quarters & Lawn",
          desc: "Protected, shaded grassy courtyard surrounding the daycare facility"
        }
      ],
      shortDesc: "A safe, fun, and secure outdoor play environment with modern playground equipment for children of faculty staff.",
      fullDesc: "Designed to support academic and non-academic staff with young families, the Kids Play Area features modern, child-safe playground equipment, cushioned impact-absorbing turf, swings, slides, and educational sensory play features. Situated within a secure, fenced perimeter adjacent to staff quarters and day-care facilities, ensuring peace of mind for university employees.",
      location: "Staff Residential & Welfare Wing, Mattegoda",
      hours: "Mon - Fri: 8:00 AM - 5:30 PM (Weekends for staff residents)",
      features: [
        "Impact-absorbing rubber safety flooring and non-toxic playground apparatus",
        "Interactive climbing frames, spiral slides, baby swings, and sand play area",
        "Fenced, secure perimeter with child-proof safety gate and surveillance",
        "Shaded benches and stroller pathways for parents and caregivers"
      ],
      specs: [
        { label: "Safety Standard", value: "Impact-Absorbing Rubberized Flooring" },
        { label: "Age Group", value: "Children aged 2 to 10 years" },
        { label: "Security", value: "Fenced Perimeter & Guard Supervision" },
        { label: "Beneficiary", value: "Academic & Non-Academic Staff Families" }
      ],
      inCharge: "President, Faculty Staff Welfare Society",
      contactEmail: "staff.welfare@eng.sjp.ac.lk"
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
      image: "11audi.jpg",
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
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135416571.jpg",
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
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2025/01/deptee.jpg",
      showImageOnMap: true,
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
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/Lecture-Hall-L211A-New.jpg",
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
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-1-1.jpg",
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
      image: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/FOE-Win-Gold-at-National-AI-Awards-2026-1-scaled.jpg",
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
      image: "22outaudi.jpg",
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
      image: "main_canteen.jpg",
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
      image: "https://lh3.googleusercontent.com/d/1hF9PiVfa6hy_pgaZlqhtxU9Wov1g2iX5",
      showImageOnMap: true,
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
      image: "https://zzirxpncvhqxhcjgbuek.supabase.co/storage/v1/object/public/facilities/gym_canteen.jpg",
      showImageOnMap: true,
      hours: "Daily: 6:30 AM - 8:00 PM",
      desc: "Dedicated sports cafeteria adjoining the gym pavilion offering protein bars, energy shakes, freshly blended citrus juices, and post-workout snacks.",
      tag: "Sports Dining",
      highlights: ["Protein Shakes & Smoothies", "Fresh Fruit Juices", "Post-Workout Snacks", "Quick Refreshments"],
      floors: [
        { level: "Ground Level", desc: "Sports Nutrition Counter, Protein Smoothies & Energy Snacks Bar" }
      ]
    }
  ],
  library_books: [
    {
      id: 1,
      title: "Soil Mechanics and Foundations",
      author: "Muni Budhu",
      category: "Civil Engineering",
      availability_status: "Available",
      official_link: "https://www.wiley.com/en-us/Soil+Mechanics+and+Foundations%2C+3rd+Edition-p-9780470556849",
      cover_image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80"
    },
    {
      id: 2,
      title: "Design of Reinforced Concrete Structures",
      author: "Jack C. McCormac & Russell H. Brown",
      category: "Civil Engineering",
      availability_status: "Available",
      official_link: "https://www.wiley.com/en-us/Design+of+Reinforced+Concrete%2C+10th+Edition-p-9781118879108",
      cover_image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"
    },
    {
      id: 3,
      title: "Structural Analysis (SI Edition)",
      author: "R. C. Hibbeler",
      category: "Civil Engineering",
      availability_status: "On Loan",
      official_link: "https://www.pearson.com/en-us/subject-catalog/p/structural-analysis/P200000003299",
      cover_image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80"
    },
    {
      id: 4,
      title: "Shigley's Mechanical Engineering Design",
      author: "Richard G. Budynas & J. Keith Nisbett",
      category: "Mechanical Engineering",
      availability_status: "Available",
      official_link: "https://www.mheducation.com/highered/product/shigley-s-mechanical-engineering-design-budynas-nisbett/M9780073398204.html",
      cover_image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80"
    },
    {
      id: 5,
      title: "Thermodynamics: An Engineering Approach",
      author: "Yunus A. Çengel & Michael A. Boles",
      category: "Mechanical Engineering",
      availability_status: "Available",
      official_link: "https://www.mheducation.com/highered/product/thermodynamics-engineering-approach-cengel-boles/M9781259822674.html",
      cover_image_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80"
    },
    {
      id: 6,
      title: "Fluid Mechanics: Fundamentals and Applications",
      author: "Yunus A. Çengel & John M. Cimbala",
      category: "Mechanical Engineering",
      availability_status: "Reference Only",
      official_link: "https://www.mheducation.com/highered/product/fluid-mechanics-fundamentals-applications-cengel-cimbala/M9781259696534.html",
      cover_image_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80"
    },
    {
      id: 7,
      title: "Introduction to Algorithms (4th Edition)",
      author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
      category: "Computer Science",
      availability_status: "Available",
      official_link: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      cover_image_url: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&q=80"
    },
    {
      id: 8,
      title: "Computer Networking: A Top-Down Approach",
      author: "James F. Kurose & Keith W. Ross",
      category: "Computer Science",
      availability_status: "Available",
      official_link: "https://www.pearson.com/en-us/subject-catalog/p/computer-networking-a-top-down-approach/P200000003335",
      cover_image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80"
    },
    {
      id: 9,
      title: "Clean Architecture: A Craftsman's Guide",
      author: "Robert C. Martin",
      category: "Computer Science",
      availability_status: "Available",
      official_link: "https://www.pearson.com/en-us/subject-catalog/p/clean-architecture-a-craftsmans-guide-to-software-structure-and-design/P200000009650",
      cover_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80"
    },
    {
      id: 10,
      title: "Microelectronic Circuits (8th Edition)",
      author: "Adel S. Sedra, Kenneth C. Smith, Tony Chan Carusone, Vincent Gaudet",
      category: "Electrical Engineering",
      availability_status: "Available",
      official_link: "https://global.oup.com/ushe/product/microelectronic-circuits-9780190853464",
      cover_image_url: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&q=80"
    },
    {
      id: 11,
      title: "Electric Machinery Fundamentals",
      author: "Stephen J. Chapman",
      category: "Electrical Engineering",
      availability_status: "On Loan",
      official_link: "https://www.mheducation.com/highered/product/electric-machinery-fundamentals-chapman/M9780073529547.html",
      cover_image_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80"
    },
    {
      id: 12,
      title: "Modern Control Engineering (5th Edition)",
      author: "Katsuhiko Ogata",
      category: "Electrical Engineering",
      availability_status: "Available",
      official_link: "https://www.pearson.com/en-us/subject-catalog/p/modern-control-engineering/P200000003310",
      cover_image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80"
    },
    {
      id: 13,
      title: "Advanced Engineering Mathematics",
      author: "Erwin Kreyszig",
      category: "Mathematics",
      availability_status: "Available",
      official_link: "https://www.wiley.com/en-us/Advanced+Engineering+Mathematics%2C+10th+Edition-p-9780470458365",
      cover_image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80"
    },
    {
      id: 14,
      title: "Probability & Statistics for Engineers & Scientists",
      author: "Ronald E. Walpole, Raymond H. Myers, Sharon L. Myers, Keying Ye",
      category: "Mathematics",
      availability_status: "Available",
      official_link: "https://www.pearson.com/en-us/subject-catalog/p/probability-statistics-for-engineers-scientists/P200000003328",
      cover_image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80"
    },
    {
      id: 15,
      title: "Principles of Fire Behavior & Safety Engineering",
      author: "James G. Quintiere",
      category: "Civil Engineering",
      availability_status: "Available",
      official_link: "https://www.crcpress.com/Principles-of-Fire-Behavior/Quintiere/p/book/9781498735629",
      cover_image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80"
    }
  ]
};

export { FOE_DATA };
export default FOE_DATA;
if (typeof window !== 'undefined') {
  window.FOE_DATA = FOE_DATA;
}
