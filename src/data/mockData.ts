import { ServiceDetail, SiteSettings } from '../types';

export const CLINIC_SETTINGS: SiteSettings = {
  clinicName: "FIRST AVENUE DENTISTRY",
  phone: "(519) 207-6890",
  emergencyPhone: "(519) 207-6890",
  email: "firstavenuedentistry@gmail.com",
  address: "308 Wellington Street, St. Thomas, ON N5R 2S9",
  hours: {
    weekdays: "9:00 AM – 6:00 PM",
    saturday: "9:00 AM – 5:00 PM",
    sunday: "Closed"
  },
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2923.548145882235!2d-81.199367!3d42.773443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c1f1a1a1a1a1a%3A0x1a1a1a1a1a1a1a1a!2s308%20Wellington%20St%2C%20St.%20Thomas%2C%20ON%20N5R%202S9!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca",
  metaTitle: "First Avenue Dentistry | Family & Cosmetic Dentist in St. Thomas, ON",
  metaDescription: "Experience family-friendly dentistry at First Avenue Dentistry in St. Thomas, ON. General dentistry, cosmetic dentistry, children's dentistry, emergency care, and more. Open 6 days a week."
};

export const SERVICES_LIST = [
  { id: "crowns-bridges", label: "CROWNS & BRIDGES", category: "General Dentistry" },
  { id: "wisdom-teeth-extraction", label: "WISDOM TEETH EXTRACTION", category: "General Dentistry" },
  { id: "oral-surgery", label: "ORAL SURGERY", category: "General Dentistry" },
  { id: "teeth-cleaning", label: "TEETH CLEANING", category: "General Dentistry" },
  { id: "root-canals", label: "ROOT CANALS", category: "General Dentistry" },
  { id: "orthodontics", label: "ORTHODONTICS", category: "Cosmetic Dentistry" },
  { id: "sedation-sleep-dentistry", label: "SEDATION SLEEP DENTISTRY", category: "Additional Services" },
  { id: "childrens-dentistry", label: "CHILDREN'S DENTISTRY", category: "Children's Dentistry" },
  { id: "porcelain-veneers", label: "VENEERS", category: "Cosmetic Dentistry" },
  { id: "teeth-whitening", label: "TEETH WHITENING", category: "Cosmetic Dentistry" },
  { id: "dental-implant", label: "IMPLANT", category: "General Dentistry" },
  { id: "oral-cancer-screening", label: "ORAL CANCER SCREENING", category: "Additional Services" }
];

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  "crowns-bridges": {
    id: "crowns-bridges",
    title: "CROWNS & BRIDGES",
    description: "Dental crowns and bridges are custom-made, natural-looking solutions to restore damaged or missing teeth, enhancing your smile and oral health.",
    fullDescription: "A dental crown is a custom-made cap that covers a damaged tooth, restoring its shape, size, strength, and appearance. A dental bridge is a prosthetic appliance used to replace one or more missing teeth permanently. Crowns are placed on the adjacent teeth to support the artificial tooth (pontic) in between. They are designed to match your natural teeth, providing both aesthetic and functional restoration. Whether you have a single damaged tooth or multiple missing teeth, crowns and bridges can help you regain your smile and confidence.",
    image: "https://static.wixstatic.com/media/02c124_f6a657617ebb45e9a028fdd2dca29e1a~mv2.jpeg",
    image2: "https://static.wixstatic.com/media/02c124_70c7a476afed4c9da3ec4fe122081c22~mv2.jpg",
    benefits: [
      "Restores natural appearance of teeth",
      "Long-lasting and durable solution",
      "Protects weak or broken teeth",
      "Improves chewing and speaking ability"
    ],
    procedure: "The procedure typically requires two visits. During the first visit, the tooth is prepared, impressions are taken, and a temporary crown is placed. The permanent crown or bridge is custom-made and fitted during the second visit.",
    recoveryTime: "Minimal recovery. Some sensitivity may occur for a few days after procedure."
  },
  "wisdom-teeth-extraction": {
    id: "wisdom-teeth-extraction",
    title: "WISDOM TEETH EXTRACTION",
    description: "Wisdom teeth, or third molars, are the last teeth to develop and often need removal due to overcrowding, impaction, or other dental issues.",
    fullDescription: "Wisdom teeth extraction is a common oral surgery procedure to remove one or more wisdom teeth. These teeth typically emerge between ages 17 and 25 and can cause problems if there isn't enough space in the mouth. Impacted wisdom teeth may lead to pain, infection, cysts, or damage to adjacent teeth. Early removal can prevent these complications and protect your oral health.",
    image: "https://static.wixstatic.com/media/02c124_bfd56d5c986d465ea09e0bc641b8ce19~mv2.jpg",
    image2: "https://static.wixstatic.com/media/2a38c2_60925e6373074c3f824f0c7406d9675b~mv2.jpg",
    benefits: [
      "Prevents overcrowding and misalignment",
      "Eliminates pain and discomfort",
      "Reduces risk of infection and cysts",
      "Protects adjacent healthy teeth"
    ],
    procedure: "The extraction is performed under local anesthesia or sedation. The dentist makes an incision in the gum tissue, removes any bone blocking access to the tooth, and extracts the tooth. The area is then cleaned and stitched.",
    recoveryTime: "Most patients recover within 3-7 days. Swelling typically subsides after 48-72 hours."
  },
  "oral-surgery": {
    id: "oral-surgery",
    title: "ORAL SURGERY",
    description: "Oral surgery encompasses a variety of surgical procedures to treat conditions affecting the mouth, teeth, jaws, and facial structures.",
    fullDescription: "Oral surgery includes flap procedure, bone regeneration, surgical extractions, and other advanced treatments. These procedures address complex dental issues that go beyond routine care. Our experienced team uses advanced techniques and technology to ensure your comfort and optimal outcomes.",
    image: "https://static.wixstatic.com/media/02c124_1c6b710482d34664b3449bfcba361a22~mv2.png",
    image2: "https://static.wixstatic.com/media/02c124_062930b112c1496c820a4b17900f679c~mv2.jpg",
    benefits: [
      "Treats complex dental conditions",
      "Preserves natural teeth when possible",
      "Improves oral function and aesthetics",
      "Advanced techniques minimize discomfort"
    ],
    procedure: "The specific procedure depends on the condition being treated. Our dentist will discuss the treatment plan, anesthesia options, and aftercare instructions before proceeding.",
    recoveryTime: "Recovery varies by procedure. Most patients resume normal activities within 3-7 days."
  },
  "teeth-cleaning": {
    id: "teeth-cleaning",
    title: "TEETH CLEANING",
    description: "Professional teeth cleaning is essential for maintaining healthy teeth and gums, preventing cavities, and detecting oral health issues early.",
    fullDescription: "Regular dental cleanings remove plaque, tartar, and stains that regular brushing and flossing can't reach. Our hygienists use specialized instruments to clean above and below the gumline, followed by polishing and fluoride treatment. Professional cleanings every six months are recommended for optimal oral health.",
    image: "https://static.wixstatic.com/media/02c124_c10d90879d644b038c00d1be31fd0a71~mv2.png",
    image2: "https://static.wixstatic.com/media/02c124_dfd538860cf840c39904f44e3ce54fdd~mv2.jpg",
    benefits: [
      "Prevents cavities and gum disease",
      "Removes stubborn stains and tartar",
      "Freshens breath",
      "Early detection of oral health issues"
    ],
    procedure: "A typical cleaning includes scaling to remove plaque and tartar, polishing to smooth teeth, and fluoride treatment for added protection.",
    recoveryTime: "Immediate. No downtime required."
  },
  "root-canals": {
    id: "root-canals",
    title: "ROOT CANALS",
    description: "Root canal therapy treats infection or damage inside the tooth pulp, relieving pain and saving the natural tooth from extraction.",
    fullDescription: "Root canal therapy, also known as endodontic treatment, involves removing infected or damaged pulp from inside the tooth, cleaning and disinfecting the root canals, and sealing them to prevent reinfection. It is the most effective way to save a tooth that might otherwise need extraction. With modern techniques and anesthesia, root canals are comfortable and often no more painful than getting a filling.",
    image: "https://static.wixstatic.com/media/02c124_400afbbdf28e42fbaf428dbb572dca7c~mv2.jpg",
    benefits: [
      "Saves natural tooth from extraction",
      "Eliminates tooth pain and infection",
      "Restores normal chewing function",
      "Prevents spread of infection"
    ],
    procedure: "The procedure involves numbing the area, creating an opening in the tooth, removing infected pulp, cleaning and shaping the root canals, and sealing them. A crown is typically placed afterward for protection.",
    recoveryTime: "Mild discomfort for a few days. Most patients return to normal activities the next day."
  },
  "orthodontics": {
    id: "orthodontics",
    title: "ORTHODONTICS",
    description: "Orthodontic treatment corrects misaligned teeth and jaws, improving both the appearance and function of your smile.",
    fullDescription: "Orthodontics involves the diagnosis, prevention, and treatment of dental and facial irregularities. Using braces, clear aligners, or other orthodontic appliances, we can straighten teeth, correct bite issues, and improve overall oral health. A beautiful, straight smile not only boosts confidence but also makes cleaning easier and reduces the risk of tooth decay and gum disease.",
    image: "https://static.wixstatic.com/media/02c124_5e97129f6986410390e5572908fd0c01~mv2.png",
    image2: "https://static.wixstatic.com/media/nsplsh_5882e045a4ef4be1978588324dbaf783~mv2.jpg",
    benefits: [
      "Straightens teeth and corrects bite",
      "Boosts confidence and smile aesthetics",
      "Improves oral hygiene and health",
      "Suitable for all ages"
    ],
    procedure: "After a consultation and digital scan, a custom treatment plan is created. Patients may choose from traditional braces, clear aligners, or other options. Regular adjustments monitor progress.",
    recoveryTime: "Mild discomfort for 2-3 days after adjustments. Normal activities resume immediately."
  },
  "sedation-sleep-dentistry": {
    id: "sedation-sleep-dentistry",
    title: "SEDATION SLEEP DENTISTRY",
    description: "Sedation dentistry offers a relaxing, anxiety-free dental experience using various sedation methods tailored to your comfort level.",
    fullDescription: "For patients with dental anxiety, fear, or those undergoing extensive procedures, sedation dentistry provides a safe and effective way to receive dental care without stress. We offer multiple levels of sedation including nitrous oxide (laughing gas), oral sedation, combination sedation, IV sedation, and general anesthesia. Our team will help you choose the best option for your needs and comfort.",
    image: "https://static.wixstatic.com/media/02c124_245366fdd9b5419a83277b27d096b776~mv2.jpg",
    benefits: [
      "Eliminates dental anxiety and fear",
      "Pain-free treatment experience",
      "Complete multiple procedures in one visit",
      "Safe and monitored by trained professionals"
    ],
    procedure: "Depending on the type of sedation chosen, you may take medication before your appointment or receive it during your visit. Vital signs are monitored throughout the procedure.",
    recoveryTime: "Varies by sedation type. Most patients recover within a few hours. You will need someone to drive you home."
  },
  "childrens-dentistry": {
    id: "childrens-dentistry",
    title: "CHILDREN'S DENTISTRY",
    description: "Children's dentistry focuses on the oral health of children from infancy through adolescence, providing preventive care and education.",
    fullDescription: "We create a welcoming, fun environment for children to build positive associations with dental visits. Our pediatric services include regular check-ups, cleanings, fluoride treatments, sealants, and education on proper brushing and flossing. Early dental visits help prevent cavities and establish good oral hygiene habits for life.",
    image: "https://static.wixstatic.com/media/02c124_505fb38312254e2d9c7973cdf23795ef~mv2.jpg",
    image2: "https://static.wixstatic.com/media/02c124_768849cc9d6d44ba9ec9251b43a9ed3a~mv2.jpg",
    benefits: [
      "Builds positive dental habits early",
      "Prevents cavities and tooth decay",
      "Monitors dental development",
      "Comfortable, child-friendly environment"
    ],
    procedure: "First visits typically include a gentle exam, cleaning, fluoride application, and education. We explain everything in kid-friendly language.",
    recoveryTime: "Immediate. No downtime."
  },
  "porcelain-veneers": {
    id: "porcelain-veneers",
    title: "VENEERS",
    description: "Porcelain veneers are thin, custom-made shells that cover the front surface of teeth to improve their appearance and create a beautiful smile.",
    fullDescription: "Veneers are an excellent solution for correcting discolored, chipped, misaligned, or irregularly shaped teeth. Each veneer is custom-crafted from high-quality porcelain to match your natural teeth. The procedure is minimally invasive and can transform your smile in just a few visits. A free consultation is available to discuss your smile goals.",
    image: "https://static.wixstatic.com/media/02c124_5bb300faceb64e6883d2915a34540555~mv2.jpg",
    benefits: [
      "Creates a natural, beautiful smile",
      "Stain-resistant surface",
      "Minimally invasive procedure",
      "Long-lasting results"
    ],
    procedure: "After consultation and smile design, a thin layer of enamel is removed, impressions are taken, and temporary veneers may be placed. Permanent veneers are bonded during a follow-up visit.",
    recoveryTime: "Immediate recovery. Some minor sensitivity may occur for a few days."
  },
  "teeth-whitening": {
    id: "teeth-whitening",
    title: "TEETH WHITENING",
    description: "Professional teeth whitening safely and effectively lightens your teeth, removing stains and discoloration for a brighter smile.",
    fullDescription: "Our professional whitening treatments use safe, effective bleaching agents to lighten teeth by 2-6 shades in a single visit. Unlike over-the-counter products, professional whitening is customized to your teeth and monitored by our dental team for safety and optimal results. We offer in-office and take-home whitening options.",
    image: "https://static.wixstatic.com/media/02c124_5f00f5684aff4a10bc0c1cbd8611a100~mv2.jpg",
    benefits: [
      "Brighter smile in one visit",
      "Safe, professional-grade treatment",
      "Customized to your teeth",
      "Longer-lasting results than store-bought"
    ],
    procedure: "After a dental exam, a protective barrier is applied to gums. The whitening gel is applied to teeth and activated with a special light. Multiple sessions may be done in one appointment.",
    recoveryTime: "Immediate. May experience temporary sensitivity for 24-48 hours."
  },
  "dental-implant": {
    id: "dental-implant",
    title: "IMPLANT",
    description: "Dental implants are permanent, natural-looking replacements for missing teeth that restore function, aesthetics, and oral health.",
    fullDescription: "A dental implant is an artificial tooth root made of biocompatible titanium that is surgically placed into the jawbone. Over time, the implant fuses with the bone, providing a stable foundation for a crown, bridge, or denture. Implants look, feel, and function like natural teeth, and they help preserve jawbone health by preventing bone loss.",
    image: "https://static.wixstatic.com/media/02c124_07a5f150f1524b999d81f08829e81f1b~mv2.jpg",
    benefits: [
      "Permanent solution for missing teeth",
      "Preserves jawbone health",
      "Restores full chewing function",
      "Natural appearance and feel"
    ],
    procedure: "The implant is surgically placed into the jawbone under local anesthesia. After healing (osseointegration), an abutment and custom crown are attached to complete the restoration.",
    recoveryTime: "Initial healing 7-10 days. Full integration takes 3-6 months. Most patients return to work within 1-2 days."
  },
  "oral-cancer-screening": {
    id: "oral-cancer-screening",
    title: "ORAL CANCER SCREENING",
    description: "Oral cancer screening is a quick, painless examination to detect early signs of oral cancer, significantly improving treatment outcomes.",
    fullDescription: "We use the advanced VELscope system for oral cancer screening, a two-step process that is quick, pain-free, and non-invasive. VELscope uses natural tissue fluorescence to help identify abnormal tissue that may not be visible under normal light. Early detection of oral cancer dramatically increases survival rates and treatment success.",
    image: "https://static.wixstatic.com/media/02c124_5975d2c8b7514c7c8443d3d1372a914f~mv2.jpg",
    benefits: [
      "Early detection saves lives",
      "Quick and painless procedure",
      "Advanced VELscope technology",
      "Non-invasive screening"
    ],
    procedure: "A visual examination of the mouth is performed, followed by VELscope fluorescence screening. The entire process takes just a few minutes during your regular checkup.",
    recoveryTime: "Immediate. No downtime."
  }
};

export const HOME_FEATURES = [
  {
    title: "Comfort-first care",
    description: "We prioritize your comfort with a gentle approach and relaxing environment.",
    image: "https://static.wixstatic.com/media/2a5871_f75ac588ee2045fd8dee936181e78335~mv2.png"
  },
  {
    title: "Family-friendly",
    description: "A welcoming environment for patients of all ages, from children to seniors.",
    image: "https://static.wixstatic.com/media/2a5871_534662cc62d64d69b239750c1e84aa38~mv2.png"
  },
  {
    title: "Family-friendly",
    description: "Convenient scheduling for the whole family in one location.",
    image: "https://static.wixstatic.com/media/2a5871_82e8a36d59654ff19b7d915a6b9037a4~mv2.png"
  },
  {
    title: "Open 6 days a week",
    description: "Monday to Friday 9am-6pm, Saturday 9am-5pm. We're here when you need us.",
    image: "https://static.wixstatic.com/media/2a5871_4a8dc2a469c5410ca826805966e156ab~mv2.png"
  }
];

export const SERVICE_CATEGORIES_HOME = [
  {
    id: "general",
    title: "General Dentistry",
    image: "https://static.wixstatic.com/media/2a5871_648ce195d771443cb085750d5b723df6~mv2.png",
    items: [
      "Crowns & Bridges",
      "Wisdom Teeth Extraction",
      "Oral Surgery",
      "Teeth Cleaning",
      "Root Canals",
      "Implants"
    ]
  },
  {
    id: "cosmetic",
    title: "Cosmetic Dentistry",
    image: "https://static.wixstatic.com/media/2a5871_cdc1694d568c49dc94e0ebcc9f934022~mv2.png",
    items: [
      "Orthodontics",
      "Veneers",
      "Teeth Whitening"
    ]
  },
  {
    id: "childrens",
    title: "Children's Dentistry",
    image: "https://static.wixstatic.com/media/2a5871_3d3719093388497985747a34ac547818~mv2.png",
    items: [
      "Pediatric Checkups",
      "Dental Sealants",
      "Fluoride Treatments",
      "Child-friendly Education"
    ]
  },
  {
    id: "additional",
    title: "Additional Services",
    image: "https://static.wixstatic.com/media/2a5871_f81cded37a6b4d36af3a02e617a1d2e2~mv2.png",
    items: [
      "Sedation Sleep Dentistry",
      "Oral Cancer Screening"
    ]
  }
];

export const PILLARS_OF_CARE = [
  {
    number: "01",
    title: "Emergency",
    description: "Prompt care when you need it most. We prioritize emergency cases to relieve pain and address urgent dental issues quickly."
  },
  {
    number: "02",
    title: "Family",
    description: "Comprehensive care for every member of your family, from young children to grandparents, all in one welcoming location."
  },
  {
    number: "03",
    title: "Cosmetic",
    description: "Enhance your smile with our range of cosmetic dentistry options, designed to boost your confidence and improve your appearance."
  }
];

export const ABOUT_VALUES = [
  {
    title: "Compassionate care",
    description: "We treat every patient with genuine kindness and understanding, ensuring you feel valued and respected throughout your visit.",
    image: "https://static.wixstatic.com/media/2a5871_c8a27c7c647a441eb322bac5ade383c4~mv2.png"
  },
  {
    title: "Trusted expertise",
    description: "Our team brings years of experience and ongoing education to provide you with the highest standard of dental care.",
    image: "https://static.wixstatic.com/media/2a5871_1f560e8fe1fc49a6a4b931e9fae0337d~mv2.png"
  },
  {
    title: "Modern environment",
    description: "Our clinic features state-of-the-art technology and a comfortable, modern setting to enhance your dental experience.",
    image: "https://static.wixstatic.com/media/2a5871_e16ca33f831b46159384987c5812d700~mv2.png"
  }
];

export const BLOG_POSTS = [
  {
    id: "blog-1",
    title: "Understanding the Average Cost of Invisalign in Canada",
    category: "Orthodontics",
    author: "firstavenuedentist",
    date: "June 8, 2026",
    readTime: "3 min read",
    excerpt: "Invisalign has become increasingly popular in Canada as a preferred method for teeth straightening. Learn about the factors affecting costs and available payment options.",
    content: "Invisalign has become increasingly popular in Canada as a preferred method for teeth straightening. The cost varies depending on the complexity of the case, treatment duration, and geographic location...",
    image: "https://static.wixstatic.com/media/02c124_5e97129f6986410390e5572908fd0c01~mv2.png"
  },
  {
    id: "blog-2",
    title: "Top Tips for Children's Dental Care Tips",
    category: "Children's Dentistry",
    author: "firstavenuedentist",
    date: "June 7, 2026",
    readTime: "4 min read",
    excerpt: "Proper dental care from an early age sets the foundation for a lifetime of healthy smiles. Here are essential tips for parents.",
    content: "Establishing good oral hygiene habits early is crucial for your child's long-term dental health...",
    image: "https://static.wixstatic.com/media/02c124_505fb38312254e2d9c7973cdf23795ef~mv2.jpg"
  },
  {
    id: "blog-3",
    title: "Transform Your Look with Cosmetic Smile Enhancements",
    category: "Cosmetic Dentistry",
    author: "firstavenuedentist",
    date: "May 25, 2026",
    readTime: "3 min read",
    excerpt: "Cosmetic dentistry offers a range of treatments to enhance your smile, from professional whitening to complete smile makeovers with veneers.",
    content: "Your smile is one of the first things people notice about you. Cosmetic dentistry can help you achieve the smile you've always wanted...",
    image: "https://static.wixstatic.com/media/02c124_5bb300faceb64e6883d2915a34540555~mv2.jpg"
  },
  {
    id: "blog-4",
    title: "The Importance of Regular Dental Checkups",
    category: "General Dentistry",
    author: "firstavenuedentist",
    date: "May 25, 2026",
    readTime: "3 min read",
    excerpt: "Regular dental checkups are essential for maintaining optimal oral health and preventing serious dental problems before they develop.",
    content: "Many people only visit the dentist when they experience pain or discomfort. However, regular checkups are crucial for preventing problems before they start...",
    image: "https://static.wixstatic.com/media/02c124_c10d90879d644b038c00d1be31fd0a71~mv2.png"
  }
];
