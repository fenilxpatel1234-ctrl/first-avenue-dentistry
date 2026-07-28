import { ServiceDetail, SiteSettings } from '../types';

export const CLINIC_SETTINGS: SiteSettings = {
  clinicName: "FIRST AVENUE DENTISTRY",
  phone: "(519) 207-6890",
  emergencyPhone: "(519) 207-6890",
  email: "firstavenuedentistry@gmail.com",
  address: "308 Wellington Street, St.Thomas, ON N5R 2S9",
  hours: {
    weekdays: "9:00 AM – 6:00 PM",
    saturday: "9:00 AM – 5:00 PM",
    sunday: "Closed"
  },
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5854.366449585679!2d-81.1935522!3d42.7729288!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c3f59f6ca02e9%3A0xc210721f8780be1!2s308%20Wellington%20St%2C%20St%20Thomas%2C%20ON%20N5R%202S9!5e0!3m2!1sen!2sca!4v1743176668953!5m2!1sen!2sca",
  metaTitle: "First Avenue Dentistry | St. Thomas Dentist",
  metaDescription: "First Avenue Dentistry provides comprehensive dental care in St. Thomas. We offer general, cosmetic, and emergency dentistry for the whole family."
};

export const SERVICES_LIST = [
  { id: "crowns-bridges", label: "Crowns & Bridges", description: "Restore damaged or missing teeth with natural-looking crowns and bridges.", icon: "Building" },
  { id: "wisdom-teeth-extraction", label: "Wisdom Teeth Extraction", description: "Safe and gentle removal of problematic wisdom teeth.", icon: "Scissors" },
  { id: "oral-surgery", label: "Oral Surgery", description: "Expert surgical care for complex dental conditions.", icon: "Scissors" },
  { id: "teeth-cleaning", label: "Teeth Cleaning", description: "Professional cleanings to maintain optimal oral health.", icon: "Stethoscope" },
  { id: "root-canals", label: "Root Canals", description: "Gentle, effective treatment to save infected teeth.", icon: "Zap" },
  { id: "orthodontics", label: "Orthodontics", description: "Straighten your teeth with braces or clear aligners.", icon: "Eye" },
  { id: "sedation-sleep-dentistry", label: "Sedation Sleep Dentistry", description: "Comfortable, anxiety-free dental care.", icon: "Moon" },
  { id: "childrens-dentistry", label: "Children's Dentistry", description: "Gentle, kid-friendly dental care for healthy smiles.", icon: "Heart" },
  { id: "porcelain-veneers", label: "Veneers", description: "Custom porcelain shells for a beautiful smile.", icon: "Sparkles" },
  { id: "teeth-whitening", label: "Teeth Whitening", description: "Brighten your smile with professional whitening.", icon: "Sun" },
  { id: "dental-implant", label: "Implant", description: "Permanent, natural-looking tooth replacement.", icon: "Aperture" },
  { id: "oral-cancer-screening", label: "Oral Cancer Screening", description: "Quick, painless screening for early detection.", icon: "Shield" },
];

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  "crowns-bridges": { id: "crowns-bridges", title: "CROWNS & BRIDGES", description: "Dental crowns and bridges are custom-made, natural-looking solutions to restore damaged or missing teeth.", fullDescription: "A dental crown is a custom-made cap that covers a damaged tooth, restoring its shape, size, strength, and appearance. A dental bridge is a prosthetic appliance used to replace one or more missing teeth permanently.", image: "https://static.wixstatic.com/media/02c124_f6a657617ebb45e9a028fdd2dca29e1a~mv2.jpeg", image2: "https://static.wixstatic.com/media/02c124_70c7a476afed4c9da3ec4fe122081c22~mv2.jpg", benefits: ["Restores natural appearance", "Long-lasting and durable", "Protects weak or broken teeth", "Improves chewing and speaking"], procedure: "Requires two visits. First visit: tooth preparation and impressions. Second visit: permanent crown placement.", recoveryTime: "Minimal recovery. Some sensitivity may occur." },
  "wisdom-teeth-extraction": { id: "wisdom-teeth-extraction", title: "WISDOM TEETH EXTRACTION", description: "Wisdom teeth often need removal due to overcrowding or impaction.", fullDescription: "Wisdom teeth extraction is a common oral surgery procedure to remove one or more wisdom teeth that can cause pain, infection, or damage to adjacent teeth.", image: "https://static.wixstatic.com/media/02c124_bfd56d5c986d465ea09e0bc641b8ce19~mv2.jpg", image2: "https://static.wixstatic.com/media/2a38c2_60925e6373074c3f824f0c7406d9675b~mv2.jpg", benefits: ["Prevents overcrowding", "Eliminates pain", "Reduces infection risk", "Protects adjacent teeth"], procedure: "Performed under local anesthesia or sedation. Tooth is removed, area is cleaned and stitched.", recoveryTime: "Most recover within 3-7 days." },
  "oral-surgery": { id: "oral-surgery", title: "ORAL SURGERY", description: "Oral surgery treats conditions affecting the mouth, teeth, jaws, and facial structures.", fullDescription: "Oral surgery includes flap procedure, bone regeneration, surgical extractions, and other advanced treatments.", image: "https://static.wixstatic.com/media/02c124_1c6b710482d34664b3449bfcba361a22~mv2.png", image2: "https://static.wixstatic.com/media/02c124_062930b112c1496c820a4b17900f679c~mv2.jpg", benefits: ["Treats complex conditions", "Preserves natural teeth", "Improves function", "Advanced techniques"], procedure: "Depends on the condition being treated.", recoveryTime: "Most resume normal activities within 3-7 days." },
  "teeth-cleaning": { id: "teeth-cleaning", title: "TEETH CLEANING", description: "Professional cleaning removes plaque and tartar brushing can't reach.", fullDescription: "Regular dental cleanings remove plaque, tartar, and stains, followed by polishing and fluoride treatment. Recommended every six months.", image: "https://static.wixstatic.com/media/02c124_c10d90879d644b038c00d1be31fd0a71~mv2.png", image2: "https://static.wixstatic.com/media/02c124_dfd538860cf840c39904f44e3ce54fdd~mv2.jpg", benefits: ["Prevents cavities", "Removes stains", "Freshens breath", "Early detection"], procedure: "Scaling to remove buildup, polishing, and fluoride treatment.", recoveryTime: "Immediate. No downtime." },
  "root-canals": { id: "root-canals", title: "ROOT CANALS", description: "Root canal therapy saves infected teeth from extraction.", fullDescription: "Root canal therapy removes infected pulp, cleans and seals the tooth to prevent reinfection.", image: "https://static.wixstatic.com/media/02c124_400afbbdf28e42fbaf428dbb572dca7c~mv2.jpg", benefits: ["Saves natural tooth", "Eliminates pain", "Restores function", "Prevents infection spread"], procedure: "Area is numbed, infected pulp removed, canals cleaned and sealed.", recoveryTime: "Mild discomfort for a few days." },
  "orthodontics": { id: "orthodontics", title: "ORTHODONTICS", description: "Corrects misaligned teeth and jaws for better appearance and function.", fullDescription: "Using braces, clear aligners, or other appliances to straighten teeth and correct bite issues.", image: "https://static.wixstatic.com/media/02c124_5e97129f6986410390e5572908fd0c01~mv2.png", image2: "https://static.wixstatic.com/media/nsplsh_5882e045a4ef4be1978588324dbaf783~mv2.jpg", benefits: ["Straightens teeth", "Boosts confidence", "Improves hygiene", "All ages"], procedure: "Custom treatment plan with braces or aligners. Regular adjustments.", recoveryTime: "Mild discomfort after adjustments." },
  "sedation-sleep-dentistry": { id: "sedation-sleep-dentistry", title: "SEDATION SLEEP DENTISTRY", description: "Anxiety-free dental care with various sedation options.", fullDescription: "Multiple sedation levels including nitrous oxide, oral sedation, IV sedation, and general anesthesia.", image: "https://static.wixstatic.com/media/02c124_245366fdd9b5419a83277b27d096b776~mv2.jpg", benefits: ["Eliminates anxiety", "Pain-free", "Multiple procedures in one visit", "Monitored by professionals"], procedure: "Sedation administered before or during procedure. Vital signs monitored.", recoveryTime: "Need someone to drive you home." },
  "childrens-dentistry": { id: "childrens-dentistry", title: "CHILDREN'S DENTISTRY", description: "Gentle dental care for children from infancy through adolescence.", fullDescription: "We create a welcoming environment for kids with check-ups, cleanings, fluoride, sealants, and education.", image: "https://static.wixstatic.com/media/02c124_505fb38312254e2d9c7973cdf23795ef~mv2.jpg", image2: "https://static.wixstatic.com/media/02c124_768849cc9d6d44ba9ec9251b43a9ed3a~mv2.jpg", benefits: ["Builds positive habits", "Prevents cavities", "Monitors development", "Child-friendly"], procedure: "Gentle exam, cleaning, fluoride, and education in kid-friendly language.", recoveryTime: "Immediate." },
  "porcelain-veneers": { id: "porcelain-veneers", title: "VENEERS", description: "Custom shells that cover front tooth surface for a beautiful smile.", fullDescription: "Veneers correct discolored, chipped, or misaligned teeth. Custom-crafted from high-quality porcelain.", image: "https://static.wixstatic.com/media/02c124_5bb300faceb64e6883d2915a34540555~mv2.jpg", benefits: ["Natural beautiful smile", "Stain-resistant", "Minimally invasive", "Long-lasting"], procedure: "Enamel removed, impressions taken, veneers bonded.", recoveryTime: "Minor sensitivity may occur." },
  "teeth-whitening": { id: "teeth-whitening", title: "TEETH WHITENING", description: "Professional whitening lightens teeth 2-6 shades safely.", fullDescription: "Safe, effective bleaching agents customized to your teeth for optimal results.", image: "https://static.wixstatic.com/media/02c124_5f00f5684aff4a10bc0c1cbd8611a100~mv2.jpg", benefits: ["Brighter smile", "Professional-grade", "Customized", "Longer-lasting"], procedure: "Protective barrier applied, gel activated with light.", recoveryTime: "Temporary sensitivity possible." },
  "dental-implant": { id: "dental-implant", title: "IMPLANT", description: "Permanent natural-looking replacements for missing teeth.", fullDescription: "Titanium implant placed in jawbone fuses over time, providing foundation for crown, bridge, or denture.", image: "https://static.wixstatic.com/media/02c124_07a5f150f1524b999d81f08829e81f1b~mv2.jpg", benefits: ["Permanent solution", "Preserves jawbone", "Full function", "Natural feel"], procedure: "Implant surgically placed. After healing, crown attached.", recoveryTime: "Initial healing 7-10 days. Full integration 3-6 months." },
  "oral-cancer-screening": { id: "oral-cancer-screening", title: "ORAL CANCER SCREENING", description: "Quick painless screening for early oral cancer detection.", fullDescription: "VELscope system uses tissue fluorescence to identify abnormal tissue not visible under normal light.", image: "https://static.wixstatic.com/media/02c124_5975d2c8b7514c7c8443d3d1372a914f~mv2.jpg", benefits: ["Early detection saves lives", "Quick and painless", "Advanced technology", "Non-invasive"], procedure: "Visual exam followed by VELscope screening.", recoveryTime: "Immediate." }
};

export const HOME_FEATURES = [
  { title: "Comfort-first care", description: "We prioritize your comfort with a gentle approach and relaxing environment.", image: "https://static.wixstatic.com/media/2a5871_f75ac588ee2045fd8dee936181e78335~mv2.png" },
  { title: "Family-friendly", description: "A welcoming environment for patients of all ages, from children to seniors.", image: "https://static.wixstatic.com/media/2a5871_534662cc62d64d69b239750c1e84aa38~mv2.png" },
  { title: "Family-friendly", description: "Convenient scheduling for the whole family in one location.", image: "https://static.wixstatic.com/media/2a5871_82e8a36d59654ff19b7d915a6b9037a4~mv2.png" },
  { title: "Open 6 days a week", description: "Monday to Friday 9am-6pm, Saturday 9am-5pm. We're here when you need us.", image: "https://static.wixstatic.com/media/2a5871_4a8dc2a469c5410ca826805966e156ab~mv2.png" }
];

export const SERVICE_CATEGORIES_HOME = [
  { id: "general", title: "General Dentistry", image: "https://static.wixstatic.com/media/2a5871_648ce195d771443cb085750d5b723df6~mv2.png", items: ["Crowns & Bridges", "Wisdom Teeth Extraction", "Oral Surgery", "Teeth Cleaning", "Root Canals", "Implants"] },
  { id: "cosmetic", title: "Cosmetic Dentistry", image: "https://static.wixstatic.com/media/2a5871_cdc1694d568c49dc94e0ebcc9f934022~mv2.png", items: ["Orthodontics", "Veneers", "Teeth Whitening"] },
  { id: "childrens", title: "Children's Dentistry", image: "https://static.wixstatic.com/media/2a5871_3d3719093388497985747a34ac547818~mv2.png", items: ["Pediatric Checkups", "Dental Sealants", "Fluoride Treatments"] },
  { id: "additional", title: "Additional Services", image: "https://static.wixstatic.com/media/2a5871_82e8a36d59654ff19b7d915a6b9037a4~mv2.png", items: ["Sedation Sleep Dentistry", "Oral Cancer Screening"] }
];

export const ABOUT_VALUES = [
  { title: "Expert Team", description: "Our skilled dentists and staff bring years of experience and a passion for patient care to every visit.", image: "https://static.wixstatic.com/media/2a5871_648ce195d771443cb085750d5b723df6~mv2.png" },
  { title: "Advanced Technology", description: "We use the latest dental technology for precise diagnostics and comfortable treatments.", image: "https://static.wixstatic.com/media/2a5871_82e8a36d59654ff19b7d915a6b9037a4~mv2.png" },
  { title: "Compassionate Care", description: "Your comfort matters. We take time to listen, explain, and ensure a positive dental experience.", image: "https://static.wixstatic.com/media/2a5871_cdc1694d568c49dc94e0ebcc9f934022~mv2.png" }
];

export const PILLARS_OF_CARE = [
  { number: "01", title: "Emergency", description: "Prompt care when you need it most. We prioritize emergency cases to relieve pain and address urgent dental issues quickly." },
  { number: "02", title: "Family", description: "Comprehensive care for every member of your family, from young children to grandparents, all in one welcoming location." },
  { number: "03", title: "Cosmetic", description: "Enhance your smile with our range of cosmetic dentistry options, designed to boost your confidence and improve your appearance." }
];

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Understanding the Average Cost of Invisalign in Canada",
    slug: "understanding-the-average-cost-of-invisalign-in-canada",
    category: "Orthodontics",
    author: "firstavenuedentist",
    date: "June 8, 2026",
    readTime: "4 min read",
    excerpt: "Invisalign offers a modern alternative to traditional braces. Learn about the average cost of Invisalign in Canada, what influences the price, and how you can plan for this investment in your smile.",
    content: "If you've been thinking about straightening your teeth but want a discreet and comfortable option, Invisalign might be the perfect choice for you. Invisalign offers a modern alternative to traditional braces, using clear aligners that are nearly invisible. But one of the biggest questions on everyone's mind is: how much does Invisalign cost in Canada?\n\nWhen it comes to Invisalign, the cost can vary quite a bit depending on several factors. On average, Invisalign treatment in Canada ranges from $3,000 to $8,000. This wide range might seem confusing at first, but it makes sense once you understand what goes into the pricing.\n\nKey factors that influence the average cost of Invisalign include the severity of your dental issues, length of treatment, location and dental clinic reputation, and any additional dental work needed. For example, a simple case of minor teeth alignment might cost closer to $3,000, while a more complex case involving bite correction could push the price toward $8,000.\n\nInvisalign is very effective at closing gaps between teeth. Your dentist will create a custom treatment plan using 3D modeling to design a series of aligners tailored to close your gaps. Each set of aligners shifts your teeth slightly until the gaps close.\n\nTo budget for Invisalign treatment, check your dental insurance coverage, ask about flexible payment plans, consider using health spending accounts, and compare quotes from trusted dentists.",
    image: "https://static.wixstatic.com/media/02c124_15be3807a9ef463e81a3a2b168bcec33~mv2.png"
  },
  {
    id: "blog-2",
    title: "Top Tips for Children's Dental Care Tips",
    slug: "top-tips-for-children-s-dental-care-tips",
    category: "Children's Dentistry",
    author: "firstavenuedentist",
    date: "June 7, 2026",
    readTime: "4 min read",
    excerpt: "Healthy teeth and gums set the foundation for a lifetime of good oral health. Here are simple, practical, and effective tips to keep your child's teeth strong and bright.",
    content: "Taking care of your child's smile is one of the most important things you can do as a parent. When kids learn healthy habits early, they're more likely to keep those habits as adults. Start early and be consistent. Even before your baby's first tooth appears, clean their gums with a soft, damp cloth. Once teeth start coming in, use a small, soft-bristled toothbrush designed for infants. Brush twice a day, especially before bedtime.\n\nFor children under 3 years old, use a smear of fluoride toothpaste about the size of a grain of rice. For kids aged 3 to 6, a pea-sized amount is enough. Make brushing fun by turning it into a game or a song. Use colorful toothbrushes with their favorite characters or play a two-minute timer.\n\nThe Canadian Dental Association recommends that children see a dentist by their first birthday or within six months of their first tooth coming in. Regular dental visits help prevent problems and keep your child's smile shining bright.",
    image: "https://static.wixstatic.com/media/02c124_9c6dff57aa6e4791bfc89b16674d8059~mv2.png"
  },
  {
    id: "blog-3",
    title: "Transform Your Look with Cosmetic Smile Enhancements",
    slug: "transform-your-look-with-cosmetic-smile-enhancements",
    category: "Cosmetic Dentistry",
    author: "firstavenuedentist",
    date: "May 25, 2026",
    readTime: "4 min read",
    excerpt: "A smile makeover can dramatically improve your appearance and boost your confidence. Explore the options available and how to start your journey to a radiant smile.",
    content: "A smile is one of the first things people notice about you. It can light up a room, boost your confidence, and even improve your overall appearance. Cosmetic smile enhancements are dental treatments designed to improve the appearance of your teeth and gums.\n\nCommon cosmetic smile enhancements include teeth whitening to brighten stained or dull teeth, veneers to cover imperfections like chips or gaps, dental bonding to repair minor damage, Invisalign or braces to straighten crooked teeth, and gum contouring to improve gum lines. Teeth whitening typically costs $200 to $600, veneers range from $800 to $2,500 per tooth, dental bonding is $300 to $600 per tooth, Invisalign ranges from $3,000 to $7,000, and gum contouring costs $500 to $3,000.\n\nThe process starts with scheduling a consultation, creating a personalized treatment plan, beginning treatments, and maintaining your results. Professional care ensures your treatments are safe, effective, and tailored to your unique needs.",
    image: "https://static.wixstatic.com/media/02c124_e944377bf4a944199708bfbbbf405cef~mv2.png"
  },
  {
    id: "blog-4",
    title: "The Importance of Regular Dental Checkups",
    slug: "the-importance-of-regular-dental-checkups",
    category: "General Dentistry",
    author: "firstavenuedentist",
    date: "May 25, 2026",
    readTime: "4 min read",
    excerpt: "Regular dental checkups play a crucial role in maintaining your oral health and overall well-being. Learn why prevention is better than cure.",
    content: "Taking care of your smile is more than just brushing and flossing at home. Regular dental checkups play a crucial role in maintaining your oral health and overall well-being. Regular dental checkups are essential because they help catch problems early. Many dental issues, like cavities or gum disease, don't show obvious symptoms at first.\n\nDuring your checkup, the dentist will examine your teeth, gums, and mouth for cavities, gum inflammation, signs of oral cancer, and other issues. Professional cleaning removes plaque and tartar buildup that regular brushing can't reach.\n\nIn Canada, the price of a basic dental exam and cleaning can cost between $100 and $250. Many dental plans or insurance may cover part or all of the cost.",
    image: "https://static.wixstatic.com/media/02c124_bba688f957e1434eba66736a69fb6982~mv2.png"
  },
  {
    id: "blog-5",
    title: "Discover Invisalign Treatment Options in St. Thomas",
    slug: "discover-invisalign-treatment-options-in-st-thomas",
    category: "Orthodontics",
    author: "firstavenuedentist",
    date: "May 21, 2026",
    readTime: "4 min read",
    excerpt: "Explore Invisalign treatment options available in St. Thomas, how clear aligners work, and why they might be the perfect choice for your smile transformation.",
    content: "If you've been thinking about straightening your teeth but dread the idea of bulky metal braces, you're not alone. Many people want a discreet, comfortable way to improve their smile. That's where Invisalign comes in. Invisalign treatment options offer a modern, nearly invisible solution to align your teeth without the hassle of traditional braces.\n\nInvisalign is a clear aligner system designed to gradually move your teeth into the desired position. Instead of brackets and wires, Invisalign uses a series of custom-made, transparent plastic trays that fit snugly over your teeth. You wear each set of aligners for about one to two weeks before switching to the next set.\n\nInvisalign treatment options include Invisalign Full for moderate to severe cases, Invisalign Lite for mild to moderate issues, Invisalign Express for very minor corrections, and Invisalign Teen for younger patients. Your dentist will help you choose the best option based on your dental condition and goals.",
    image: "https://static.wixstatic.com/media/02c124_5c3fe914735e42e7a63d822f39d876d2~mv2.png"
  },
  {
    id: "blog-6",
    title: "Breaking Down Invisalign Costs in Canada: Clear Aligner Pricing Insights",
    slug: "breaking-down-invisalign-costs-in-canada-clear-aligner-pricing-insights",
    category: "Orthodontics",
    author: "firstavenuedentist",
    date: "May 11, 2026",
    readTime: "4 min read",
    excerpt: "A detailed breakdown of Invisalign costs in Canada with clear aligner pricing insights to help you make an informed decision about your orthodontic treatment.",
    content: "If you've been thinking about straightening your teeth, you've probably heard about Invisalign. It's a popular alternative to traditional braces, offering a discreet and comfortable way to get the smile you want. When it comes to Invisalign, the cost can vary quite a bit depending on several factors, including the complexity of your case, the length of treatment, and where you live.\n\nIn Canada, Invisalign treatment typically ranges from $3,000 to $8,000. Factors affecting cost include the severity of your dental issues, length of treatment, location and dental clinic, and additional dental work needed.\n\nTo budget for Invisalign treatment, get a consultation for a personalized treatment plan, check your dental insurance coverage, ask about payment plans, and compare clinics.",
    image: "https://static.wixstatic.com/media/02c124_e9a21a7812d14b76ab075bde81a31cf9~mv2.png"
  },
  {
    id: "blog-7",
    title: "Welcome to Your Trusted Family Dentist in St. Thomas",
    slug: "welcome-to-your-trusted-family-dentist-in-st-thomas",
    category: "General Dentistry",
    author: "firstavenuedentist",
    date: "May 10, 2026",
    readTime: "5 min read",
    excerpt: "Finding the right dental care in St. Thomas. Learn how our clinic supports families with gentle, expert care from wisdom teeth extraction to Invisalign and dental implants.",
    content: "Finding the right dental care can feel overwhelming. You want a place that welcomes new patients, offers a range of services, and is ready to help in emergencies. Our clinic supports families and individuals with gentle, expert care.\n\nWe offer wisdom teeth extraction with modern techniques to reduce pain and speed healing. For those wanting to straighten teeth without traditional braces, Invisalign clear aligners provide a discreet option. Dental implants offer a strong, natural-looking solution for missing teeth.\n\nWe also provide emergency dentist services in St. Thomas, preventive care, restorative treatments, cosmetic dentistry, orthodontics, periodontal care, pediatric dentistry, and sedation dentistry.",
    image: "https://static.wixstatic.com/media/02c124_a052a5b7325c4cacb7f5d010771a1911~mv2.png"
  },
  {
    id: "blog-8",
    title: "Essential Oral Health Advice for Children: A Parent's Guide",
    slug: "essential-oral-health-advice-for-children-a-parent-s-guide",
    category: "Children's Dentistry",
    author: "firstavenuedentist",
    date: "May 4, 2026",
    readTime: "4 min read",
    excerpt: "Healthy smiles start early. Get essential oral health advice for children with simple, effective tips to help your little ones develop great dental habits.",
    content: "Taking care of your child's teeth might feel overwhelming at times, but it doesn't have to be complicated. Healthy smiles start early, and with the right guidance, you can help your little ones develop great habits that last a lifetime.\n\nStart early by cleaning your baby's gums with a soft, damp cloth even before teeth appear. Once teeth come in, use a small, soft-bristled toothbrush. Brush twice a day with a pea-sized amount of fluoride toothpaste. Floss daily once two teeth touch.\n\nLimit sugary treats and drinks, choose nutritious snacks like fruits and vegetables, encourage water, and avoid frequent snacking. The Canadian Dental Association recommends children see a dentist by their first birthday.",
    image: "https://static.wixstatic.com/media/02c124_ecb0df25662e4a25af86b817001404da~mv2.png"
  },
  {
    id: "blog-9",
    title: "Achieve Your Dream Smile in St. Thomas with Customized Smile Services",
    slug: "achieve-your-dream-smile-in-st-thomas-with-customized-smile-services",
    category: "Cosmetic Dentistry",
    author: "firstavenuedentist",
    date: "April 27, 2026",
    readTime: "4 min read",
    excerpt: "Transform your smile with customized smile services in St. Thomas. From whitening to veneers and implants, discover personalized dental care options.",
    content: "A bright, confident smile can change everything. Customized smile services mean your dental care is tailored specifically to your mouth, your goals, and your comfort.\n\nPopular options include professional teeth whitening ($200-$600), porcelain veneers ($800-$2,500 per tooth), dental crowns ($1,000-$1,500 per tooth), orthodontics ($3,000-$8,000), dental implants ($3,000-$5,000 per implant), and gum contouring ($500-$1,500).\n\nStart with a consultation, create your treatment plan, begin treatment, and maintain your results with regular check-ups and good oral hygiene.",
    image: "https://static.wixstatic.com/media/02c124_82f464fb02934e748ea7abd0ad15e814~mv2.png"
  },
  {
    id: "blog-10",
    title: "Schedule Your Next Dental Checkup with Ease: Routine Oral Health Checkups Made Simple",
    slug: "schedule-your-next-dental-checkup-with-ease-routine-oral-health-checkups-made-simple",
    category: "General Dentistry",
    author: "firstavenuedentist",
    date: "April 20, 2026",
    readTime: "4 min read",
    excerpt: "Make scheduling your dental checkup easy. Learn why routine oral health checkups matter and how to prepare for your next visit.",
    content: "Taking care of your smile is easier than you think. Routine oral health checkups are essential for keeping your teeth and gums healthy. They help catch problems early, prevent pain, and save you money in the long run.\n\nDuring your checkup, the dentist will examine your teeth and gums for signs of decay or disease, clean your teeth to remove plaque and tartar, check for oral cancer, and offer advice on brushing, flossing, and diet.\n\nTo prepare, check your schedule, gather your dental history, list your questions or concerns, and bring your insurance information. In Canada, a basic dental exam and cleaning can cost between $100 and $250.",
    image: "https://static.wixstatic.com/media/02c124_cc00130e3abe4ec098b7c81014db3b12~mv2.png"
  },
  {
    id: "blog-11",
    title: "Debunking Dental Implant Myths: What You Need to Know",
    slug: "debunking-dental-implant-myths-what-you-need-to-know",
    category: "Restorative Dentistry",
    author: "firstavenuedentist",
    date: "April 3, 2024",
    readTime: "2 min read",
    excerpt: "Dental implants are a popular tooth replacement option, but several myths surround them. Our experts debunk common misconceptions about dental implants.",
    content: "When it comes to tooth replacement, getting dental implants has become a popular option because of their long-term effectiveness, durability, and functionality. This dental procedure is a great alternative to bridges and dentures.\n\nMyth #1: Dental Implants Are Painful - The procedure is typically performed with local anesthesia, making it completely painless. Most patients only report mild discomfort manageable with over-the-counter medication.\n\nMyth #2: Dental Implants Are Unaffordable - Dental implants offer a great return on investment and help save money in the long run since they are a one-time investment.\n\nMyth #3: Dental Implants Don't Last Long - Dental implants are designed to last a very long time with proper care. Caring for implants is similar to caring for natural teeth.\n\nMyth #4: It's Hard to Talk or Eat with Implants - Dental implants are modeled after your natural teeth and feel just as natural after the procedure.",
    image: "https://static.wixstatic.com/media/2a38c2_982e06d93283414b94488388a8b707a1~mv2.png"
  },
  {
    id: "blog-12",
    title: "Protecting Your Smile During Cold and Flu Season: Dental Care Tips",
    slug: "protecting-your-smile-during-cold-and-flu-season-dental-care-tips",
    category: "General Dentistry",
    author: "firstavenuedentist",
    date: "March 27, 2024",
    readTime: "2 min read",
    excerpt: "Cold and flu season can impact your teeth and gums. Learn how to protect your oral health during seasonal illnesses with these expert dental care tips.",
    content: "Whenever you start experiencing chills, body aches, sniffles, and a sore throat, you know the flu and cold season are upon us. Seasonal illnesses can impact your teeth and gums, leading to dental health concerns.\n\nStick to a proper oral hygiene routine even if you're feeling unwell. Brush your teeth twice a day and floss daily to prevent plaque and bacteria build-up. Drink plenty of liquids to stay hydrated, as dry mouth can increase cavity-causing bacteria. Saltwater gargles can help decrease oral bacteria and provide throat relief.",
    image: "https://static.wixstatic.com/media/2a38c2_352f508fae974cd6890c1a3cb0df6a77~mv2.png"
  },
  {
    id: "blog-13",
    title: "Invisalign and Oral Health: A Comprehensive Guide to Maintaining Dental Wellness",
    slug: "invisalign-and-oral-health-a-comprehensive-guide-to-maintaining-dental-wellness",
    category: "Orthodontics",
    author: "firstavenuedentist",
    date: "March 20, 2024",
    readTime: "2 min read",
    excerpt: "A comprehensive guide to maintaining dental wellness during Invisalign treatment, including proper cleaning techniques and oral hygiene routines.",
    content: "Having a confident smile isn't easy when you're not sure about your dental alignment. Clear aligners or Invisalign is one of the most popular options to address structural concerns of the teeth.\n\nInvisalign is made from a flexible and thin thermoplastic material called SmartTrack. When compared to traditional metal braces, these orthodontic devices are more discreet, comfortable, and BPA and gluten-free.\n\nDuring Invisalign treatment, being extra careful about your oral health becomes crucial. Neglecting oral hygiene can lead to gum disease, teeth discoloration, and cavities. Clean your aligners by gently brushing them with a soft-bristled toothbrush and non-abrasive toothpaste. Maintain regular dental checkups throughout the treatment.",
    image: "https://static.wixstatic.com/media/2a38c2_23c159f94bcf46a88e05e070ceab4940~mv2.png"
  },
  {
    id: "blog-14",
    title: "Invisalign and Oral Health: A Comprehensive Guide to Maintaining Dental Wellness - Infographics",
    slug: "invisalign-and-oral-health-a-comprehensive-guide-to-maintaining-dental-wellness-infographics",
    category: "Orthodontics",
    author: "firstavenuedentist",
    date: "March 23, 2024",
    readTime: "1 min read",
    excerpt: "Explore a comprehensive infographic guide to maintaining dental wellness during Invisalign treatment.",
    content: "This infographic provides a visual guide to maintaining dental wellness during Invisalign treatment. Learn about proper cleaning techniques, oral hygiene routines, and the importance of regular dental checkups throughout your orthodontic journey.",
    image: "https://static.wixstatic.com/media/2a38c2_23c159f94bcf46a88e05e070ceab4940~mv2.png"
  },
  {
    id: "blog-15",
    title: "Navigating Oral Health Challenges in Seniors: Common Issues and Solutions",
    slug: "navigating-oral-health-challenges-in-seniors-common-issues-and-solutions",
    category: "Senior Dentistry",
    author: "firstavenuedentist",
    date: "March 15, 2024",
    readTime: "2 min read",
    excerpt: "Learn about common oral health challenges faced by seniors, including dry mouth, gum problems, and cavities, along with effective solutions.",
    content: "Your oral health is the window to your overall health. With age, it's not uncommon for people to experience dental issues related to other health conditions.\n\nCommon dental problems in seniors include dry mouth (caused by medications and health conditions), gum disease (receding gums, loose teeth, swollen gums), and dental cavities (caused by severe plaque buildup).\n\nTo combat these issues, stay hydrated, practice good oral hygiene habits like flossing regularly, brushing twice a day with fluoride toothpaste, and visit your dentist regularly for professional care.",
    image: "https://static.wixstatic.com/media/2a38c2_a3e08c427c7d48949989ba87c77f6330~mv2.png"
  },
  {
    id: "blog-16",
    title: "Better Dental Health Starts Here",
    slug: "bec4d2a5",
    category: "General Dentistry",
    author: "firstavenuedentist",
    date: "October 31, 2022",
    readTime: "1 min read",
    excerpt: "Everything you need to know about keeping your smile healthy and bright at every age. Helpful resources to spread oral health awareness.",
    content: "Better dental health starts with understanding the basics of oral care. Everything you need to know about keeping your smile healthy and bright at every age, with helpful resources to spread oral health awareness.",
    image: "https://static.wixstatic.com/media/02c124_ae7e8cdf31554a09b31ea577af4928c0~mv2.jpg"
  },
  {
    id: "blog-17",
    title: "What are some signs I should see a dentist?",
    slug: "what-are-some-signs-i-should-see-a-dentist",
    category: "General Dentistry",
    author: "firstavenuedentist",
    date: "October 29, 2022",
    readTime: "1 min read",
    excerpt: "Learn about the key signs that indicate it's time to visit your dentist, from tooth sensitivity to persistent bad breath and oral pain.",
    content: "Here are the signs that indicate you should see a dentist: Your teeth are sensitive to hot or cold, your gums are puffy and/or bleed when you brush or floss, you have fillings, crowns, dental implants, or dentures, you don't like the way your smile or teeth look, you have persistent bad breath or bad taste in your mouth, you are pregnant, you have pain or swelling in your mouth, face or neck, you have difficulty chewing or swallowing, you have a family history of gum disease or tooth decay, you have a medical condition such as diabetes or cardiovascular disease, your mouth is often dry, you smoke or use other tobacco products, you are undergoing medical treatment such as radiation or chemotherapy, your jaw sometimes pops or is painful, or you have a spot or sore that doesn't look or feel right.",
    image: "https://static.wixstatic.com/media/02c124_cc18bd0c29ba417595ab475b92457222~mv2.jpg"
  },
  {
    id: "blog-18",
    title: "What can I expect during a dental checkup?",
    slug: "what-can-i-expect-during-a-dental-checkup",
    category: "General Dentistry",
    author: "firstavenuedentist",
    date: "October 14, 2022",
    readTime: "1 min read",
    excerpt: "Know what to expect during your dental checkup. From medical history review to oral examination and cleaning, we walk you through the process.",
    content: "During a dental checkup, the dentist or hygienist will ask about your recent medical history, examine your mouth, and decide whether or not you need X-rays. They will check your teeth, gums, and mouth for any signs of problems, clean your teeth to remove plaque and tartar, and provide personalized advice for maintaining your oral health at home.",
    image: "https://static.wixstatic.com/media/02c124_ae7e8cdf31554a09b31ea577af4928c0~mv2.jpg"
  },
  {
    id: "blog-19",
    title: "Why do regular dental visits matter?",
    slug: "why-do-regular-dental-visits-matter",
    category: "General Dentistry",
    author: "firstavenuedentist",
    date: "October 11, 2022",
    readTime: "1 min read",
    excerpt: "Regular dental visits help spot problems early when treatment is simpler and more affordable. Learn why consistent dental care matters for your health.",
    content: "Regular dental visits are important because they can help spot dental health problems early on when treatment is likely to be simpler and more affordable. They also help prevent many problems from developing in the first place. Visiting your dentist regularly is also important because some diseases or medical conditions have symptoms that can appear in the mouth.",
    image: "https://static.wixstatic.com/media/02c124_ae7e8cdf31554a09b31ea577af4928c0~mv2.jpg"
  },
  {
    id: "blog-20",
    title: "I'm not having any symptoms. Do I still need to see a dentist?",
    slug: "i-m-not-having-any-symptoms-do-i-still-need-to-see-a-dentist",
    category: "General Dentistry",
    author: "firstavenuedentist",
    date: "October 10, 2022",
    readTime: "1 min read",
    excerpt: "Even without symptoms, regular dental visits are essential. Many dental health problems can only be diagnosed by a professional during a routine exam.",
    content: "Yes. Even if you don't have any symptoms, you can still have dental health problems that only a dentist can diagnose. Regular dental visits are crucial for preventive care and early detection of issues like cavities, gum disease, and oral cancer. Don't wait for pain or discomfort to schedule your next checkup.",
    image: "https://static.wixstatic.com/media/02c124_cc18bd0c29ba417595ab475b92457222~mv2.jpg"
  }
];
