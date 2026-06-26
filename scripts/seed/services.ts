import { pathToFileURL } from "url"
import { connect, disconnect } from "./db"
import { ServiceModel } from "../../models/service"

const SERVICES = [
  {
    slug: "consult",
    visible: true,
    content: {
      en: {
        name: "General Consultation",
        tag: "Consultation",
        headline: "Start with a calm, unhurried first conversation.",
        intro: "Your first appointment is a relaxed, 60-minute conversation. We'll explore what's brought you here, your history and your hopes — and leave with a clear, shared sense of the next step.",
        included: [
          "A full 60-minute private session",
          "A thorough review of your history & concerns",
          "A clear, written summary and plan",
          "Direct answers to all of your questions",
          "A warm, judgement-free space to talk",
        ],
        steps: [
          { title: "Before", desc: "Share a few details when you book — no dreaded forms." },
          { title: "During", desc: "We talk through what's on your mind, entirely at your pace." },
          { title: "After", desc: "You receive a written plan and clear next steps." },
        ],
        duration: "60 minutes",
        format: "In person or online",
        price: "From Rs. 2,000",
        followup: "Within 1 week",
      },
      ne: {
        name: "सामान्य परामर्श",
        tag: "परामर्श",
        headline: "शान्त, ढुक्कको पहिलो कुराकानीबाट सुरु गर्नुहोस्।",
        intro: "तपाईंको पहिलो अपोइन्टमेन्ट ६० मिनेटको सहज कुराकानी हो। तपाईंलाई के कुराले यहाँ ल्यायो, तपाईंको इतिहास र आशाहरूबारे हामी कुरा गर्नेछौं — र अर्को पाइलाको स्पष्ट, साझा बुझाइसहित बिदा हुनेछौं।",
        included: [
          "पूरा ६० मिनेटको निजी सत्र",
          "तपाईंको इतिहास र चिन्ताको विस्तृत समीक्षा",
          "स्पष्ट, लिखित सारांश र योजना",
          "तपाईंका सबै प्रश्नको सीधा जवाफ",
          "न्यानो, पूर्वाग्रहरहित कुराकानीको ठाउँ",
        ],
        steps: [
          { title: "अघि", desc: "बुक गर्दा केही विवरण दिनुहोस् — झन्झटिलो फारम छैन।" },
          { title: "समयमा", desc: "तपाईंको मनमा भएको कुरा हामी तपाईंकै गतिमा कुरा गर्छौं।" },
          { title: "पछि", desc: "तपाईंले लिखित योजना र स्पष्ट अर्को पाइला पाउनुहुन्छ।" },
        ],
        duration: "६० मिनेट",
        format: "व्यक्तिगत वा अनलाइन",
        price: "रु. २,००० देखि",
        followup: "१ हप्ताभित्र",
      },
    },
  },
  {
    slug: "anxiety",
    visible: true,
    content: {
      en: {
        name: "Anxiety & Depression Care",
        tag: "Mood care",
        headline: "Find steady ground again — for anxiety & low mood.",
        intro: "Whether it's persistent worry, panic, or a heaviness that won't lift, you don't have to manage it alone. We combine evidence-based treatment with genuine warmth to help you feel like yourself again.",
        included: [
          "A comprehensive mood & anxiety assessment",
          "A personalised treatment plan",
          "Medication options, if appropriate",
          "Practical, everyday coping strategies",
          "Regular reviews to track your progress",
        ],
        steps: [
          { title: "Understand", desc: "We map what you're experiencing and what triggers it." },
          { title: "Treat", desc: "Together we choose the right blend of support." },
          { title: "Recover", desc: "We adjust and review until you feel steady again." },
        ],
        duration: "50 minutes",
        format: "In person or online",
        price: "From Rs. 1,800",
        followup: "Every 2–4 weeks",
      },
      ne: {
        name: "चिन्ता र डिप्रेसन हेरचाह",
        tag: "मनोदशा हेरचाह",
        headline: "फेरि स्थिर भूमि पाउनुहोस् — चिन्ता र न्यून मनोदशाका लागि।",
        intro: "चाहे त्यो लगातारको चिन्ता, आत्तिने अवस्था, वा नउठ्ने गह्रौंपन होस्, तपाईंले एक्लै सामना गर्नुपर्दैन। हामी प्रमाणमा आधारित उपचारलाई साँचो न्यानोपनसँग जोडेर तपाईंलाई फेरि आफै जस्तो महसुस गराउँछौं।",
        included: [
          "विस्तृत मनोदशा र चिन्ता मूल्याङ्कन",
          "व्यक्तिगत उपचार योजना",
          "आवश्यक भए औषधि विकल्प",
          "व्यावहारिक, दैनिक सामना गर्ने रणनीति",
          "प्रगति अनुगमन गर्न नियमित समीक्षा",
        ],
        steps: [
          { title: "बुझ्ने", desc: "तपाईंले अनुभव गरेको कुरा र त्यसका कारण हामी पहिल्याउँछौं।" },
          { title: "उपचार", desc: "सँगै मिलेर सही सहयोग छनोट गर्छौं।" },
          { title: "निको हुने", desc: "तपाईं स्थिर नभएसम्म हामी मिलाउँदै र समीक्षा गर्दै जान्छौं।" },
        ],
        duration: "५० मिनेट",
        format: "व्यक्तिगत वा अनलाइन",
        price: "रु. १,८०० देखि",
        followup: "हरेक २–४ हप्ता",
      },
    },
  },
  {
    slug: "meds",
    visible: true,
    content: {
      en: {
        name: "Medication Management",
        tag: "Prescribing",
        headline: "The right medication, carefully managed.",
        intro: "Getting medication right is a careful, collaborative process. We prescribe thoughtfully, monitor closely and adjust as needed — always explaining the reasoning behind every decision.",
        included: [
          "A detailed medication review",
          "Clear explanation of options & effects",
          "Careful titration & monitoring",
          "Coordination with your GP",
          "Ongoing safety reviews",
        ],
        steps: [
          { title: "Review", desc: "We assess your current medication and history." },
          { title: "Prescribe", desc: "A considered plan, fully explained to you." },
          { title: "Monitor", desc: "Regular check-ins keep it working safely." },
        ],
        duration: "30–45 minutes",
        format: "In person or online",
        price: "From Rs. 1,500",
        followup: "Every 4–8 weeks",
      },
      ne: {
        name: "औषधि व्यवस्थापन",
        tag: "सिफारिस",
        headline: "सही औषधि, ध्यानपूर्वक व्यवस्थापन।",
        intro: "औषधि सही पार्नु एक सावधान, सहकार्यमूलक प्रक्रिया हो। हामी सोचविचार गरेर सिफारिस गर्छौं, नजिकबाट अनुगमन गर्छौं र आवश्यकताअनुसार मिलाउँछौं — हरेक निर्णयको कारण सधैं बुझाउँदै।",
        included: [
          "विस्तृत औषधि समीक्षा",
          "विकल्प र असरको स्पष्ट व्याख्या",
          "सावधान मात्रा मिलाउने र अनुगमन",
          "तपाईंको GP सँग समन्वय",
          "निरन्तर सुरक्षा समीक्षा",
        ],
        steps: [
          { title: "समीक्षा", desc: "तपाईंको हालको औषधि र इतिहास हामी मूल्याङ्कन गर्छौं।" },
          { title: "सिफारिस", desc: "सोचविचार गरिएको योजना, तपाईंलाई पूर्ण रूपमा बुझाइन्छ।" },
          { title: "अनुगमन", desc: "नियमित भेटघाटले यसलाई सुरक्षित राख्छ।" },
        ],
        duration: "३०–४५ मिनेट",
        format: "व्यक्तिगत वा अनलाइन",
        price: "रु. १,५०० देखि",
        followup: "हरेक ४–८ हप्ता",
      },
    },
  },
  {
    slug: "assess",
    visible: true,
    content: {
      en: {
        name: "Diagnostic Assessment",
        tag: "Assessment",
        headline: "Clarity at last — assessment for ADHD, autism & more.",
        intro: "A structured, in-depth assessment to understand what's really going on. We take the time to get it right, so you leave with answers you can trust and a clear path forward.",
        included: [
          "A structured clinical interview",
          "Validated screening tools",
          "Collateral history, where helpful",
          "A detailed written report",
          "Tailored, practical recommendations",
        ],
        steps: [
          { title: "Prepare", desc: "We gather background and any prior reports." },
          { title: "Assess", desc: "A thorough, structured evaluation." },
          { title: "Explain", desc: "We talk through the findings and next steps." },
        ],
        duration: "90 minutes",
        format: "In person or online",
        price: "From Rs. 5,000",
        followup: "Report within 2 weeks",
      },
      ne: {
        name: "नैदानिक मूल्याङ्कन",
        tag: "मूल्याङ्कन",
        headline: "अन्ततः स्पष्टता — ADHD, अटिज्म र थप मूल्याङ्कन।",
        intro: "वास्तवमा के भइरहेको छ बुझ्न संरचित, गहन मूल्याङ्कन। हामी यसलाई सही पार्न समय लिन्छौं, ताकि तपाईं भरोसा गर्न सकिने जवाफ र स्पष्ट अगाडिको बाटोसहित बिदा हुनुहोस्।",
        included: [
          "संरचित क्लिनिकल अन्तर्वार्ता",
          "प्रमाणित स्क्रिनिङ उपकरण",
          "आवश्यक भए सहायक इतिहास",
          "विस्तृत लिखित रिपोर्ट",
          "उपयुक्त, व्यावहारिक सिफारिस",
        ],
        steps: [
          { title: "तयारी", desc: "हामी पृष्ठभूमि र अघिल्ला रिपोर्ट जम्मा गर्छौं।" },
          { title: "मूल्याङ्कन", desc: "गहन, संरचित मूल्याङ्कन।" },
          { title: "व्याख्या", desc: "हामी निष्कर्ष र अर्को पाइलाबारे कुरा गर्छौं।" },
        ],
        duration: "९० मिनेट",
        format: "व्यक्तिगत वा अनलाइन",
        price: "रु. ५,००० देखि",
        followup: "२ हप्ताभित्र रिपोर्ट",
      },
    },
  },
  {
    slug: "therapy",
    visible: true,
    content: {
      en: {
        name: "Therapy & CBT",
        tag: "Therapy",
        headline: "Talk it through — therapy & CBT, tailored to you.",
        intro: "Sometimes the most powerful medicine is being truly heard. Our talking therapy and cognitive techniques are shaped around your goals, your pace and your own story.",
        included: [
          "A tailored therapy plan",
          "Evidence-based CBT techniques",
          "Practical between-session tools",
          "A confidential, steady space",
          "Regular progress reviews",
        ],
        steps: [
          { title: "Connect", desc: "We build trust and set your goals together." },
          { title: "Work", desc: "Session by session, we work the plan." },
          { title: "Grow", desc: "You carry the tools forward into daily life." },
        ],
        duration: "50 minutes",
        format: "In person or online",
        price: "From Rs. 1,200",
        followup: "Weekly or fortnightly",
      },
      ne: {
        name: "थेरापी र CBT",
        tag: "थेरापी",
        headline: "कुरा गरौं — तपाईंअनुसार थेरापी र CBT।",
        intro: "कहिलेकाहीं सबैभन्दा शक्तिशाली औषधि भनेको साँच्चै सुनिनु हो। हाम्रो वार्तालाप थेरापी र संज्ञानात्मक प्रविधि तपाईंको लक्ष्य, गति र कथाअनुसार ढालिएको हुन्छ।",
        included: [
          "तपाईंअनुसारको थेरापी योजना",
          "प्रमाणमा आधारित CBT प्रविधि",
          "सत्रबीचका व्यावहारिक उपकरण",
          "गोप्य, स्थिर ठाउँ",
          "नियमित प्रगति समीक्षा",
        ],
        steps: [
          { title: "जोडिने", desc: "हामी भरोसा बनाउँछौं र सँगै लक्ष्य तय गर्छौं।" },
          { title: "काम", desc: "सत्रदरसत्र, हामी योजना अनुसार काम गर्छौं।" },
          { title: "बढ्ने", desc: "तपाईं ती उपकरण दैनिक जीवनमा लैजानुहुन्छ।" },
        ],
        duration: "५० मिनेट",
        format: "व्यक्तिगत वा अनलाइन",
        price: "रु. १,२०० देखि",
        followup: "साप्ताहिक वा पाक्षिक",
      },
    },
  },
  {
    slug: "wellness",
    visible: true,
    content: {
      en: {
        name: "Preventive Mental Wellness",
        tag: "Wellness",
        headline: "Stay well, ahead of time.",
        intro: "Mental wellbeing isn't only about treating illness — it's about staying steady. Proactive check-ins and resilience planning help you protect what matters before things get hard.",
        included: [
          "A wellbeing check-in & screening",
          "A personalised resilience plan",
          "Sleep, stress & lifestyle guidance",
          "Early-warning planning",
          "Optional periodic reviews",
        ],
        steps: [
          { title: "Check in", desc: "A relaxed review of how you're really doing." },
          { title: "Plan", desc: "We build habits and safeguards that fit your life." },
          { title: "Sustain", desc: "Light-touch reviews keep you on track." },
        ],
        duration: "45 minutes",
        format: "In person or online",
        price: "From Rs. 1,300",
        followup: "Quarterly",
      },
      ne: {
        name: "निवारक मानसिक स्वास्थ्य",
        tag: "स्वास्थ्य",
        headline: "समयअघि नै स्वस्थ रहनुहोस्।",
        intro: "मानसिक स्वास्थ्य भनेको रोग उपचार मात्र होइन — यो स्थिर रहनेबारे पनि हो। सक्रिय भेटघाट र सहनशीलता योजनाले कुरा बिग्रनुअघि नै महत्त्वपूर्ण कुरा जोगाउन मद्दत गर्छ।",
        included: [
          "स्वास्थ्य भेटघाट र स्क्रिनिङ",
          "व्यक्तिगत सहनशीलता योजना",
          "निद्रा, तनाव र जीवनशैली मार्गदर्शन",
          "पूर्व-चेतावनी योजना",
          "वैकल्पिक आवधिक समीक्षा",
        ],
        steps: [
          { title: "भेटघाट", desc: "तपाईं वास्तवमा कस्तो हुनुहुन्छ भन्ने सहज समीक्षा।" },
          { title: "योजना", desc: "तपाईंको जीवनसुहाउँदो बानी र सुरक्षा हामी बनाउँछौं।" },
          { title: "कायम राख्ने", desc: "हल्का समीक्षाले तपाईंलाई सही बाटोमा राख्छ।" },
        ],
        duration: "४५ मिनेट",
        format: "व्यक्तिगत वा अनलाइन",
        price: "रु. १,३०० देखि",
        followup: "त्रैमासिक",
      },
    },
  },
]

export async function seedServices(): Promise<string[]> {
  const slugs = SERVICES.map((s) => s.slug)
  const count = await ServiceModel.countDocuments()
  if (count >= SERVICES.length) {
    console.log(`  services: ${count} already present — skipping`)
    return slugs
  }
  await ServiceModel.insertMany(SERVICES)
  console.log(`✓ services: seeded ${SERVICES.length}`)
  return slugs
}

// Standalone runner
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  void (async () => {
    await connect()
    await seedServices()
    await disconnect()
  })()
}
