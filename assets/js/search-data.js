// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "post-ছেলেটা",
        
          title: "ছেলেটা",
        
        description: "জীবনের ঘূর্ণিঝড়ে আটকে পড়া এক ছেলের গল্প",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cheleta/";
          
        },
      },{id: "post-a-distill-style-blog-post",
        
          title: "a distill-style blog post",
        
        description: "an example of a distill-style blog post and main elements",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/distill/";
          
        },
      },{id: "post-a-post-with-code",
        
          title: "a post with code",
        
        description: "an example of a blog post with some code",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/code/";
          
        },
      },{id: "news-joined-as-a-working-student-software-engineer-in-automation-at-elektrobit-automotive-gmbh-erlangen-de",
          title: 'Joined as a Working Student - Software Engineer in Automation at Elektrobit Automotive...',
          description: "",
          section: "News",},{id: "news-joined-as-a-working-student-data-analyst-at-bmw-group-munich-de",
          title: 'Joined as a Working Student - Data Analyst at BMW Group, Munich, DE....',
          description: "",
          section: "News",},{id: "news-joined-as-a-working-student-data-quality-manager-at-checkmybus-gmbh-nürnberg-de",
          title: 'Joined as a Working Student – Data Quality Manager at CheckMyBus GmbH, Nürnberg,...',
          description: "",
          section: "News",},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
