// ─────────────────────────────────────────────────────────────────────────
// All the site's real content lives in this one file on purpose.
// Update your details here — you shouldn't need to touch component code
// to change text, add a job, or add a blog post.
// ─────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "Sujit Debnath",
  initials: "SD",
  descriptors: "Learner · Explorer · Volunteer",
  tagline:
    "Researching how machines learn to see, and writing down what I notice along the way.",
  location: "Nürnberg, Germany",
  email: "sujit.debnath.bd@gmail.com",
  phone: "+49 157 31158609",
  photo: "/images/profile.png",
  // Verbatim from the old site's about page — links added on institution/
  // company names. The OOD project title is the one italicized phrase.
  bio: [
    {
      text: "I am a graduate student in Artificial Intelligence at Friedrich-Alexander-Universität Erlangen-Nürnberg, where my research focuses on computer vision and the foundations of machine learning. I have recently conducted a research project on the “Comparative Analysis of OOD Detection Methods on the Historical-WI Dataset” and am currently working on handwriting imitation in the context of generative modeling.",
      links: [
        {
          phrase: "Artificial Intelligence",
          href: "https://www.ai.study.fau.eu/",
        },
        {
          phrase: "Friedrich-Alexander-Universität Erlangen-Nürnberg",
          href: "https://www.fau.eu",
        },
        {
          phrase:
            "“Comparative Analysis of OOD Detection Methods on the Historical-WI Dataset”",
          italic: true,
        },
      ],
    },
    {
      text: "Alongside my studies, I am employed as a Data Quality Manager (Working Student) at CheckMyBus GmbH. I also bring prior industry experience as a working student at BMW Group and Elektrobit Automotive GmbH, complemented by expertise in data analytics, software engineering, and project management. Earlier in my career, I served as Project Coordinator at Robi Axiata Limited and as a Teaching Assistant and Lab Instructor at North South University, where I supported students in developing core computer science skills.",
      links: [
        { phrase: "CheckMyBus GmbH", href: "https://www.checkmybus.com" },
        { phrase: "BMW Group", href: "https://www.bmwgroup.com/en.html" },
        {
          phrase: "Elektrobit Automotive GmbH",
          href: "https://www.elektrobit.com",
        },
        { phrase: "Robi Axiata Limited", href: "https://www.robi.com.bd/en" },
        {
          phrase: "North South University",
          href: "https://www.northsouth.edu",
        },
      ],
    },
    {
      text: "Outside of my professional life, I enjoy volunteering for social welfare causes. In my free time, I love to read literature, including mysteries, fantasies, science fiction, and classics. When I'm not immersed in the digital world, I like to go cycling in the countryside or take peaceful walks along serene roads.",
      links: [],
    },
  ],
  socials: [
    {
      label: "GitHub",
      handle: "github.com/sujitdebnath",
      href: "https://github.com/sujitdebnath",
    },
    {
      label: "LinkedIn",
      handle: "linkedin.com/in/sujit-debnath",
      href: "https://www.linkedin.com/in/sujit-debnath/",
    },
    {
      label: "Twitter / X",
      handle: "x.com/SujitDeb007",
      href: "https://x.com/SujitDeb007",
    },
    {
      label: "Goodreads",
      handle: "goodreads.com/sujitdebnath",
      href: "https://www.goodreads.com/user/show/57290229-sujit-debnath",
    },
  ],
};

export const quote = {
  text: "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
  author: "Alan M. Turing, Computing Machinery and Intelligence",
};

export const experience = [
  {
    title: "Data Quality Manager",
    employmentType: "Working Student",
    org: "CheckMyBus GmbH",
    orgHref: "https://www.checkmybus.com",
    location: "Nürnberg, Germany",
    start: "Oct 2024",
    end: "Present",
    current: true,
    description:
      "Maintaining data integrity across mobility partners through quality checks and KPI monitoring, while collaborating with international teams to keep transport data accurate and up-to-date.",
  },
  {
    title: "Data Analyst",
    employmentType: "Working Student",
    org: "BMW Group",
    orgHref: "https://www.bmwgroup.com/en.html",
    location: "Munich, Germany",
    start: "Jul 2023",
    end: "Sep 2024",
    description:
      "Enhanced analytics workflows for the Conformity of Production digitization project, building real-time dashboards using Oracle APEX and SQL to support data-driven decisions.",
  },
  {
    title: "Software Engineer - Automation",
    employmentType: "Working Student",
    org: "Elektrobit Automotive GmbH",
    orgHref: "https://www.elektrobit.com",
    location: "Erlangen, Germany",
    start: "Jul 2022",
    end: "Apr 2023",
    description:
      "Built emergency update automation for Volkswagen EVs and developed Python and Bash scripts for ECU flashing and system-level testing.",
  },
  {
    title: "Project Coordinator",
    org: "Robi Axiata Limited",
    orgHref: "https://www.robi.com.bd/en",
    location: "Dhaka, Bangladesh",
    start: "Feb 2020",
    end: "Jan 2022",
    description:
      "Delivered pre-post KPI analyses and anomaly detection on telecom performance data, and designed a Python/SQL-based message alert system to speed up cross-team issue response.",
  },
  {
    title: "Lab Officer",
    employmentType: "Part-time",
    org: "North South University",
    orgHref: "https://www.northsouth.edu",
    location: "Dhaka, Bangladesh",
    start: "Jan 2019",
    end: "Dec 2019",
    description:
      "Conducted interactive lab sessions and developed laboratory materials and curriculum for undergraduate CS courses.",
  },
  {
    title: "Under-Graduate Assistant",
    employmentType: "Part-time",
    org: "North South University",
    orgHref: "https://www.northsouth.edu",
    location: "Dhaka, Bangladesh",
    start: "Jan 2019",
    end: "Apr 2019",
    description:
      "Supported undergraduate teaching through tutorials and assisted faculty in course-related tasks.",
  },
];

export const education = [
  {
    degree: "M.Sc. in Artificial Intelligence",
    institution: "Friedrich-Alexander-Universität Erlangen-Nürnberg",
    institutionHref: "https://www.fau.eu",
    location: "Erlangen, Germany",
    start: "2021",
    end: "Present",
    current: true,
    details:
      "Focus on computer vision and the foundations of machine learning.",
  },
  {
    degree: "B.Sc. in Computer Science and Engineering",
    institution: "North South University",
    institutionHref: "https://www.northsouth.edu",
    location: "Dhaka, Bangladesh",
    start: "2015",
    end: "2018",
    details:
      "Graduated with magna cum laude distinction, and awarded the NSU Board of Trustee Scholarship for academic excellence.",
  },
  {
    degree: "Higher Secondary Certificate",
    qualifier: "Science",
    institution: "Dhaka College",
    institutionHref: "https://dhakacollege.edu.bd",
    location: "Dhaka, Bangladesh",
    start: "2011",
    end: "2013",
    details:
      "Completed the Science group curriculum with a perfect GPA of 5.00 out of 5.00.",
  },
  {
    degree: "Secondary School Certificate",
    qualifier: "Science",
    institution: "Rampura Ekramunnesa Boys' High School",
    institutionHref: "https://www.facebook.com/rehs108012/",
    location: "Dhaka, Bangladesh",
    start: "2009",
    end: "2011",
    details:
      "Graduated with a perfect GPA of 5.00/5.00 across all nine subjects — the highest attainable distinction (Golden A+).",
  },
];

export const research = {
  current: [
    {
      title: "Handwriting Imitation in the Context of Generative Modeling",
      status: "Ongoing",
      description:
        "Exploring generative approaches to imitating individual handwriting style.",
    },
    {
      title: "Out-of-Distribution (OOD) Detection on Historical-WI Dataset",
      status: "Ongoing",
      description:
        "Leading a 5-member research team evaluating OOD detection approaches (e.g., ODIN, MSP, ViM, DICE, GradNorm) on the ScriptNet Historical-WI dataset.",
    },
  ],
  publications: [
    {
      title:
        "Bangla Short Speech Commands Recognition Using Convolutional Neural Networks",
      authors:
        "Shakil Ahmed Sumon, Joydip Chowdhury, Sujit Debnath, Nabeel Mohammed, Sifat Momen",
      venue:
        "International Conference on Bangla Speech and Language Processing (ICBSLP)",
      location: "Sylhet, Bangladesh",
      year: "2018",
      pages: "pp. 1–6",
      doi: "https://doi.org/10.1109/ICBSLP.2018.8554395",
    },
    {
      title:
        "Early Detection of Glaucoma Using Fuzzy Logic in Bangladesh Context",
      authors:
        "Nazmul Alam Diptu, Md. Asif Khan, Sujit Debnath, Abdullah Al Imam, Al Mahadi Hasan Rakib, Kazi Asfaq Ahmed Ador, Rashedur M. Rahman",
      venue: "International Conference on Intelligent Systems (IS)",
      location: "Funchal, Portugal",
      year: "2018",
      pages: "pp. 87–93",
      doi: "https://doi.org/10.1109/IS.2018.8710490",
    },
  ],
};

export const projects = [
  {
    title: "Out-of-Distribution (OOD) Detection on Historical-WI Dataset",
    description:
      "Leading a 5-member research team conducting a comprehensive evaluation of multiple OOD detection approaches (e.g., ODIN, MSP, ViM, DICE, GradNorm) using the ScriptNet Historical-WI dataset.",
    tags: ["Python", "PyTorch", "Scikit-learn", "Bash"],
    href: "https://github.com/sujitdebnath/fau-projcv-ood-detection-wi",
  },
  {
    title:
      "Large-Scale Differential Gene Expression Analysis in scRNA-seq Data",
    description:
      "Comprehensive scRNA-seq analysis for Type 2 Diabetes and MPN disease in case-control studies — data retrieval, clustering, cell annotation, DEG identification, and a web app for visualization.",
    tags: ["Python", "Scanpy", "Omicverse", "Streamlit"],
    href: "https://github.com/sujitdebnath/fau-bionets-project-ws23",
  },
  {
    title: "Impact of Weather and Climate on Bicycle Traffic in Köln",
    description:
      "A data engineering and data science project analyzing weather vs. bicycle traffic relationships in Köln, including ETL pipeline creation, system/component testing, and a CI pipeline.",
    tags: ["Python", "Bash", "SQLite", "GitHub Actions"],
    href: "https://github.com/sujitdebnath/fau-data-engineering-ss23",
  },
];

// Bucket list is brand new — these are example items so the page isn't
// blank. Replace freely; "done" just controls the strikethrough state.
export const bucketList = [
  {
    category: "Travel",
    items: [
      { label: "Example — Hike the Annapurna Circuit", done: false },
      { label: "Example — Visit the Nordic countries in winter", done: false },
    ],
  },
  {
    category: "Research & Career",
    items: [
      {
        label: "Example — Publish a first-author paper at a top CV venue",
        done: false,
      },
      { label: "Example — Finish the PhD", done: false },
    ],
  },
  {
    category: "Personal",
    items: [
      { label: "Example — Read 50 books in a year", done: false },
      { label: "Example — Cycle across a country border", done: false },
    ],
  },
  {
    category: "Skills",
    items: [
      { label: "Example — Get comfortable writing in German", done: false },
      { label: "Example — Learn to sail", done: false },
    ],
  },
];

export const nav = [
  { label: "About", hash: "#about" },
  { label: "Experience", hash: "#experience" },
  { label: "Education", hash: "#education" },
  { label: "Research", hash: "#research" },
  { label: "Projects", hash: "#projects" },
  { label: "Coffee Chat", hash: "#coffee-chat" },
  { label: "Blog", to: "/blog" },
  { label: "Bucket List", to: "/bucket-list" },
];

// Placeholder booking link — swap for your real one when set up.
export const coffeeChat = {
  title: "Let's talk",
  intro:
    "I'm happy to talk about almost anything — career plans, grad school and admissions, CV or portfolio reviews, research opportunities, project ideas, or potential collaborations. And if you're going through a difficult time, feeling stuck, or simply want to talk something through — I'm not a professional counselor, but I'm happy to listen as a friend, no need to share more than you're comfortable with.",
  topicsLabel: "A casual conversation about:",
  topics: [
    "Career planning and professional growth",
    "Graduate school applications and planning",
    "CV, portfolio, and career feedback",
    "Research discussions and collaboration ideas",
    "Software, AI, and project opportunities",
    "Business ideas, products, and entrepreneurship",
    "Personal challenges, motivation, or life experiences",
  ],
  card: {
    title: "Book a 30-min one-to-one call",
    description:
      "A 30-minute conversation to exchange ideas, discuss opportunities, or simply connect.",
    cta: "Schedule a call",
    href: "https://cal.com/TODO-add-your-link",
  },
  donationNote:
    "If there's ever a cost attached to these calls, I plan to donate the proceeds to a meaningful cause once they add up — details to come.",
};
