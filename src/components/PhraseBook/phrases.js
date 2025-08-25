const phrases = [
  // ============ Greetings & Politeness ============
  { 
    "english": "Hello", 
    "urdu": "ہیلو", 
    "pashto": "سلام", 
    "pronunciation": "Salaam" 
  },
  { 
    "english": "Good morning", 
    "urdu": "صبح بخیر", 
    "pashto": "سهار مو په خير", 
    "pronunciation": "Sahar mo pa khair" 
  },
  { 
    "english": "Good night", 
    "urdu": "شب بخیر", 
    "pashto": "شپه مو په خير", 
    "pronunciation": "Sha pa mo pa khair" 
  },
  { 
    "english": "How are you?", 
    "urdu": "آپ کیسے ہیں؟", 
    "pashto": "تاسو څنګه یاست؟", 
    "pronunciation": "Taso tsanga yast?" 
  },
  { 
    "english": "I am fine", 
    "urdu": "میں ٹھیک ہوں", 
    "pashto": "زه ښه یم", 
    "pronunciation": "Za kha yam" 
  },
  { 
    "english": "Thank you", 
    "urdu": "شکریہ", 
    "pashto": "مننه", 
    "pronunciation": "Manana" 
  },
  { 
    "english": "You're welcome", 
    "urdu": "خوش آمدید", 
    "pashto": "ښه راغلاست", 
    "pronunciation": "Kha raghlast" 
  },
  { 
    "english": "Goodbye", 
    "urdu": "خدا حافظ", 
    "pashto": "په خير دې اوسئ", 
    "pronunciation": "Pa khair de osi" 
  },
  { 
    "english": "Please", 
    "urdu": "براہ مہربانی", 
    "pashto": "لطفاً", 
    "pronunciation": "Lotfan" 
  },
  { 
    "english": "Excuse me", 
    "urdu": "معاف کیجیے", 
    "pashto": "بخښنه غواړم", 
    "pronunciation": "Bakhshna ghwaram" 
  },
  { 
    "english": "Sorry", 
    "urdu": "معذرت", 
    "pashto": "بخښنه وغواړم", 
    "pronunciation": "Bakhshna wagharram" 
  },

  // ============ Time & Dates ============
  {
    "english": "What time is it?",
    "urdu": "کتنے بجے ہیں؟",
    "pashto": "څه وخت دی؟",
    "pronunciation": "Tsah wakht day?"
  },
  {
    "english": "Today",
    "urdu": "آج",
    "pashto": "نن",
    "pronunciation": "Nan"
  },
  {
    "english": "Tomorrow",
    "urdu": "کل",
    "pashto": "سبا",
    "pronunciation": "Saba"
  },
  {
    "english": "Yesterday",
    "urdu": "کل",
    "pashto": "پرون",
    "pronunciation": "Paroon"
  },

  // ============ Weather ============
  {
    "english": "How's the weather?",
    "urdu": "موسم کیسا ہے؟",
    "pashto": "هوا څنګه ده؟",
    "pronunciation": "Hawa tsanga da?"
  },
  {
    "english": "It's hot",
    "urdu": "گرمی ہے",
    "pashto": "توده ده",
    "pronunciation": "Tawda da"
  },
  {
    "english": "It's cold",
    "urdu": "سردی ہے",
    "pashto": "يخه ده",
    "pronunciation": "Yakha da"
  },
  {
    "english": "It's raining",
    "urdu": "بارش ہو رہی ہے",
    "pashto": "باران اوریږي",
    "pronunciation": "Barān oriẓi"
  },

  // ============ Family ============
  {
    "english": "Family",
    "urdu": "خاندان",
    "pashto": "کورنۍ",
    "pronunciation": "Korṇai"
  },
  {
    "english": "Father",
    "urdu": "والد",
    "pashto": "پلار",
    "pronunciation": "Plār"
  },
  {
    "english": "Mother",
    "urdu": "والدہ",
    "pashto": "مور",
    "pronunciation": "Mor"
  },
  {
    "english": "Brother",
    "urdu": "بھائی",
    "pashto": "ورور",
    "pronunciation": "Wror"
  },
  {
    "english": "Sister",
    "urdu": "بہن",
    "pashto": "خور",
    "pronunciation": "Khwar"
  },

  // ============ Numbers ============
  {
    "english": "One",
    "urdu": "ایک",
    "pashto": "یو",
    "pronunciation": "Yaw"
  },
  {
    "english": "Two",
    "urdu": "دو",
    "pashto": "دوه",
    "pronunciation": "Dwa"
  },
  {
    "english": "Three",
    "urdu": "تین",
    "pashto": "درې",
    "pronunciation": "Dre"
  },
  {
    "english": "Four",
    "urdu": "چار",
    "pashto": "څلور",
    "pronunciation": "Tsalor"
  },
  {
    "english": "Five",
    "urdu": "پانچ",
    "pashto": "پنځه",
    "pronunciation": "Pindza"
  },
  {
    "english": "Ten",
    "urdu": "دس",
    "pashto": "لس",
    "pronunciation": "Las"
  },
  {
    "english": "Hundred",
    "urdu": "سو",
    "pashto": "سل",
    "pronunciation": "Sal"
  },

  // ============ Colors ============
  {
    "english": "Red",
    "urdu": "لال",
    "pashto": "سور",
    "pronunciation": "Sur"
  },
  {
    "english": "Blue",
    "urdu": "نیلا",
    "pashto": "آبی",
    "pronunciation": "Ābi"
  },
  {
    "english": "Green",
    "urdu": "سبز",
    "pashto": "شين",
    "pronunciation": "Shin"
  },
  {
    "english": "White",
    "urdu": "سفید",
    "pashto": "سپين",
    "pronunciation": "Spin"
  },
  {
    "english": "Black",
    "urdu": "کالا",
    "pashto": "تور",
    "pronunciation": "Tor"
  },

  // ============ Common Objects ============
  {
    "english": "Water",
    "urdu": "پانی",
    "pashto": "اوبه",
    "pronunciation": "Oba"
  },
  {
    "english": "Food",
    "urdu": "کھانا",
    "pashto": "خوراک",
    "pronunciation": "Khorāk"
  },
  {
    "english": "House",
    "urdu": "گھر",
    "pashto": "کور",
    "pronunciation": "Kor"
  },
  {
    "english": "Car",
    "urdu": "گاڑی",
    "pashto": "موټر",
    "pronunciation": "Motor"
  },
  {
    "english": "Road",
    "urdu": "سڑک",
    "pashto": "لار",
    "pronunciation": "Lār"
  },

  // ============ Business ============
  {
    "english": "I have a business meeting",
    "urdu": "میرا کاروباری میٹنگ ہے",
    "pashto": "زما د سوداګرۍ غونډه ده",
    "pronunciation": "Zama da sodāgarai ghonda da"
  },
  {
    "english": "Let's make a deal",
    "urdu": "آئیے معاہدہ کرتے ہیں",
    "pashto": "راځئ چې معامله وکړو",
    "pronunciation": "Rāẓay che moāmela wakṛo"
  },
  {
    "english": "This is my business card",
    "urdu": "یہ میرا کاروباری کارڈ ہے",
    "pashto": "دا زما د سوداګرۍ کارت دی",
    "pronunciation": "Dā zama da sodāgarai kart day"
  },

  // ============ Technology ============
  {
    "english": "Smartphone",
    "urdu": "سمارٹ فون",
    "pashto": "هوشمند ټیلیفون",
    "pronunciation": "Hoshmand telephone"
  },
  {
    "english": "Computer",
    "urdu": "کمپیوٹر",
    "pashto": "کمپیوټر",
    "pronunciation": "Computer"
  },
  {
    "english": "Internet",
    "urdu": "انٹرنیٹ",
    "pashto": "انټرنټ",
    "pronunciation": "Internet"
  },

  // ============ Traditional Pashto Phrases ============
  {
    "english": "Welcome to our home",
    "urdu": "ہمارے گھر میں خوش آمدید",
    "pashto": "زموږ کور ته ښه راغلاست",
    "pronunciation": "Zmuẓ kor ta kha rāghlāst"
  },
  {
    "english": "May you not be tired (traditional greeting)",
    "urdu": "تھکاوٹ نہ ہو",
    "pashto": "ستړي مه شئ",
    "pronunciation": "Staṛi ma she"
  },
  {
    "english": "God protect you",
    "urdu": "خدا حافظ",
    "pashto": "خداي په امان",
    "pronunciation": "Khudāy pa amān"
  },
  {
    "english": "With respect",
    "urdu": "عزت کے ساتھ",
    "pashto": "په درنښت",
    "pronunciation": "Pa drunṣht"
  },

  // ============ Pashtun Culture ============
  {
    "english": "Pashtunwali (Pashtun code)",
    "urdu": "پختونوالی",
    "pashto": "پښتونوالی",
    "pronunciation": "Pakhtunwāli"
  },
  {
    "english": "Honor",
    "urdu": "عزت",
    "pashto": "ننګ",
    "pronunciation": "Nang"
  },
  {
    "english": "Hospitality",
    "urdu": "مہمان نوازی",
    "pashto": "مېلمستيا",
    "pronunciation": "Melmastia"
  },
  {
    "english": "Hujra (community space)",
    "urdu": "حجرہ",
    "pashto": "حجره",
    "pronunciation": "Hujra"
  },

  // ============ Directions ============
  { 
    "english": "Where is the hotel?", 
    "urdu": "ہوٹل کہاں ہے؟", 
    "pashto": "هوټل چېرې دی؟", 
    "pronunciation": "Hotel chere day?" 
  },
  { 
    "english": "Where is the bus station?", 
    "urdu": "بس اسٹاپ کہاں ہے؟", 
    "pashto": "د بس تمینل چېرې دی؟", 
    "pronunciation": "Da bus terminal chere day?" 
  },
  { 
    "english": "Where is the washroom?", 
    "urdu": "ٹوائلٹ کہاں ہے؟", 
    "pashto": "تشناب چېرې دی؟", 
    "pronunciation": "Tashnab chere day?" 
  },
  { 
    "english": "How far is it?", 
    "urdu": "یہ کتنی دور ہے؟", 
    "pashto": "دا څومره لرې دی؟", 
    "pronunciation": "Da tsomra lare day?" 
  },
  { 
    "english": "Turn left", 
    "urdu": "بائیں مڑیں", 
    "pashto": "کیڼ اړول", 
    "pronunciation": "Kin arrawal" 
  },
  { 
    "english": "Turn right", 
    "urdu": "دائیں مڑیں", 
    "pashto": "ښي اړول", 
    "pronunciation": "Shi arrawal" 
  },
  { 
    "english": "Straight ahead", 
    "urdu": "سیدھا چلیں", 
    "pashto": "مستقيم ولاړ شه", 
    "pronunciation": "Mustaqeem walaar sha" 
  },
  { 
    "english": "Is this the right way?", 
    "urdu": "کیا یہ صحیح راستہ ہے؟", 
    "pashto": "آیا دا سم لار ده؟", 
    "pronunciation": "Aya da sam lar da?" 
  },

  // ============ Transportation ============
  { 
    "english": "I need a taxi", 
    "urdu": "مجھے ٹیکسی چاہیے", 
    "pashto": "زما د ټکسي ضرورت دی", 
    "pronunciation": "Zama da taxi zaroorat day" 
  },
  { 
    "english": "How much is the fare?", 
    "urdu": "کرایہ کتنا ہے؟", 
    "pashto": "کرایه څومره ده؟", 
    "pronunciation": "Kiraya tsomra da?" 
  },
  { 
    "english": "Can you take me to this address?", 
    "urdu": "کیا آپ مجھے اس پتے پر لے جا سکتے ہیں؟", 
    "pashto": "آیا تاسو زه دې پته ته بوځای شئ؟", 
    "pronunciation": "Aya taso za da pata ta bzaai shai?" 
  },
  { 
    "english": "Is this bus going to...?", 
    "urdu": "کیا یہ بس ... جا رہی ہے؟", 
    "pashto": "آیا دا بس ... ته ځي؟", 
    "pronunciation": "Aya da bus ... ta dzi?" 
  },
  { 
    "english": "Is this taxi metered?", 
    "urdu": "کیا یہ ٹیکسی میٹر سے چلتی ہے؟", 
    "pashto": "آیا دا ټکسي د میټر سره چلوي؟", 
    "pronunciation": "Aya da taxi da meter sara chalwi?" 
  },
  { 
    "english": "Does this bus go to Peshawar?", 
    "urdu": "کیا یہ بس پشاور جاتی ہے؟", 
    "pashto": "آیا دا بس پېښور ته ځي؟", 
    "pronunciation": "Aya da bus Peshawar ta dzi?" 
  },
  { 
    "english": "Is there a direct route to Swat?", 
    "urdu": "کیا سوات کا براہ راست راستہ ہے؟", 
    "pashto": "آیا سوات ته مستقیم لار شته؟", 
    "pronunciation": "Aya Swat ta mustaqeem lar shata?" 
  },

  // ============ Accommodation ============
  { 
    "english": "I have a reservation", 
    "urdu": "میری بکنگ ہے", 
    "pashto": "زما ریزرویشن شته", 
    "pronunciation": "Zama reservation shata" 
  },
  { 
    "english": "Do you have a room available?", 
    "urdu": "کیا کوئی کمرہ دستیاب ہے؟", 
    "pashto": "آیا تاسو ته خالي کوټه شته؟", 
    "pronunciation": "Aya taso ta khali kotta shata?" 
  },
  { 
    "english": "How much per night?", 
    "urdu": "ایک رات کا کرایہ کتنا ہے؟", 
    "pashto": "د یوې شپې لپاره څومره؟", 
    "pronunciation": "Da yuwe shpe lapara tsomra?" 
  },
  { 
    "english": "Can I see the room?", 
    "urdu": "کیا میں کمرہ دیکھ سکتا ہوں؟", 
    "pashto": "آیا زه کوټه وګورم؟", 
    "pronunciation": "Aya za kotta wogoram?" 
  },

  // ============ Food ============
  { 
    "english": "I am hungry", 
    "urdu": "مجھے بھوک لگی ہے", 
    "pashto": "زه وږی یم", 
    "pronunciation": "Za wzhay yam" 
  },
  { 
    "english": "What is this dish called?", 
    "urdu": "یہ کھانے کو کیا کہتے ہیں؟", 
    "pashto": "دا څه خوراک دی؟", 
    "pronunciation": "Da tsa khoraak day?" 
  },
  { 
    "english": "I am vegetarian", 
    "urdu": "میں سبزی خور ہوں", 
    "pashto": "زه سبزي خور یم", 
    "pronunciation": "Za sabzi khwar yam" 
  },
  { 
    "english": "No spicy", 
    "urdu": "مرچ نہ ڈالیں", 
    "pashto": "تند مه کوئ", 
    "pronunciation": "Tund ma kawai" 
  },
  { 
    "english": "Water please", 
    "urdu": "پانی دیں", 
    "pashto": "اوبه مهرباني", 
    "pronunciation": "Oba mehrabani" 
  },
  { 
    "english": "Check please", 
    "urdu": "بل دیں", 
    "pashto": "حساب راکړئ", 
    "pronunciation": "Hisaab rakrai" 
  },
  { 
    "english": "Is this halal?", 
    "urdu": "کیا یہ حلال ہے؟", 
    "pashto": "آیا دا حلال دی؟", 
    "pronunciation": "Aya da halal day?" 
  },

  // ============ Shopping ============
  { 
    "english": "How much is this?", 
    "urdu": "یہ کتنے کا ہے؟", 
    "pashto": "دا څومره دی؟", 
    "pronunciation": "Da tsomra day?" 
  },
  { 
    "english": "It's too expensive", 
    "urdu": "یہ بہت مہنگا ہے", 
    "pashto": "دا ډیر ګران دی", 
    "pronunciation": "Da deer ghran day" 
  },
  { 
    "english": "Can you lower the price?", 
    "urdu": "کیا آپ قیمت کم کر سکتے ہیں؟", 
    "pashto": "آیا تاسو قیمت کمولی شئ؟", 
    "pronunciation": "Aya taso qeemat kamawli shai?" 
  },
  { 
    "english": "I am just looking", 
    "urdu": "میں صرف دیکھ رہا ہوں", 
    "pashto": "زه یوازې ګورم", 
    "pronunciation": "Za yawaze goram" 
  },
  { 
    "english": "Do you accept credit cards?", 
    "urdu": "کیا آپ کریڈٹ کارڈ لیتے ہیں؟", 
    "pashto": "آیا تاسو کریډیټ کارډ منئ؟", 
    "pronunciation": "Aya taso credit card manai?" 
  },
  { 
    "english": "Is this handmade?", 
    "urdu": "کیا یہ ہاتھ سے بنا ہے؟", 
    "pashto": "آیا دا د لاسو جوړ شوی دی؟", 
    "pronunciation": "Aya da da laso jor shway day?" 
  },
  { 
    "english": "Can I pay in dollars?", 
    "urdu": "کیا میں ڈالر میں ادائیگی کر سکتا ہوں؟", 
    "pashto": "آیا زه په ډالرو ورکولی شم؟", 
    "pronunciation": "Aya za pa dalaro warkawli sham?" 
  },
  { 
    "english": "Is there a fixed price?", 
    "urdu": "کیا یہ مقررہ قیمت ہے؟", 
    "pashto": "آیا دا ټاکل شوی قیمت دی؟", 
    "pronunciation": "Aya da takal shway qeemat day?" 
  },

  // ============ Emergencies ============
  { 
    "english": "I need help", 
    "urdu": "مجھے مدد کی ضرورت ہے", 
    "pashto": "زما د مرستې ضرورت دی", 
    "pronunciation": "Zama da marste zaroorat day" 
  },
  { 
    "english": "Call the police", 
    "urdu": "پولیس کو بلائیں", 
    "pashto": "پوليس ته زنګ ووهئ", 
    "pronunciation": "Police ta zang wohai" 
  },
  { 
    "english": "I am lost", 
    "urdu": "میں راستہ بھٹک گیا ہوں", 
    "pashto": "زه لار هیروم", 
    "pronunciation": "Za lar heirom" 
  },
  { 
    "english": "I need a doctor", 
    "urdu": "مجھے ڈاکٹر چاہیے", 
    "pashto": "زما د ډاکټر ضرورت دی", 
    "pronunciation": "Zama da doctor zaroorat day" 
  },
  { 
  "english": "Where is the hospital?", 
  "urdu": "ہسپتال کہاں ہے؟", 
  "pashto": "روغتون چېرې دی؟", 
  "pronunciation": "Roghtoon chere day?" 
},
  { 
    "english": "My phone is stolen", 
    "urdu": "میرا فون چوری ہو گیا ہے", 
    "pashto": "زما ټیلیفون غلا شوی دی", 
    "pronunciation": "Zama telephone ghla shway day" 
  },
  { 
    "english": "Where is the nearest police station?", 
    "urdu": "قریب ترین پولیس اسٹیشن کہاں ہے؟", 
    "pashto": "نږدې پوليس سټېشن چېرې دی؟", 
    "pronunciation": "Nizde police station chere day?" 
  },
  { 
    "english": "Can you call a local contact for me?", 
    "urdu": "کیا آپ میرے لیے کسی مقامی رابطے کو فون کر سکتے ہیں؟", 
    "pashto": "آیا تاسو زما لپاره یو ځايي اړيکې ته زنګ ووهئ؟", 
    "pronunciation": "Aya taso zma lapara yoo zayee areeke ta zang wohai?" 
  },
  { 
    "english": "Is there a tourist helpline?", 
    "urdu": "کیا سیاحوں کے لیے ہیلپ لائن ہے؟", 
    "pashto": "آیا د سياحانو لپاره مرستې لاین شته؟", 
    "pronunciation": "Aya da sayahano lapara marste line shata?" 
  },
  { 
    "english": "I need the embassy's contact.", 
    "urdu": "مجھے ایمبیسی کا رابطہ چاہیے۔", 
    "pashto": "زما د سفارتخونې اړیکې ته ضرورت دی.", 
    "pronunciation": "Zama da sifaratkhune areeke ta zaroorat day." 
  },

  // ============ Social ============
  { 
    "english": "What is your name?", 
    "urdu": "آپ کا نام کیا ہے؟", 
    "pashto": "ستاسو نوم څه دی؟", 
    "pronunciation": "Staso nom tsah day?" 
  },
  { 
    "english": "My name is...", 
    "urdu": "میرا نام ... ہے", 
    "pashto": "زما نوم ... دی", 
    "pronunciation": "Zma nom ... day" 
  },
  { 
    "english": "Nice to meet you", 
    "urdu": "آپ سے مل کر خوشی ہوئی", 
    "pashto": "ستاسو سره د ليدو خوښۍ شوه", 
    "pronunciation": "Staso sara da leedo khuxhi shwa" 
  },
  { 
    "english": "Can I take a picture?", 
    "urdu": "کیا میں تصویر لے سکتا ہوں؟", 
    "pashto": "آیا زه انځور اخيستلی شم؟", 
    "pronunciation": "Aya za anzor akhistali sham?" 
  },

  // ============ Religion and Culture ============
  { 
    "english": "Is it okay to take pictures here?", 
    "urdu": "کیا یہاں تصویر لینا مناسب ہے؟", 
    "pashto": "آیا دلته د انځور اخيستل سم دي؟", 
    "pronunciation": "Aya dalta da anzor akhistal sam di?" 
  },
  { 
    "english": "Should I take off my shoes?", 
    "urdu": "کیا مجھے جوتے اتارنے چاہئیں؟", 
    "pashto": "آیا زه خپل بوټي وباسم؟", 
    "pronunciation": "Aya za khpal booti wabasam?" 
  },
  { 
    "english": "Can I enter?", 
    "urdu": "کیا میں اندر جا سکتا ہوں؟", 
    "pashto": "آیا زه دننه لاړ شم؟", 
    "pronunciation": "Aya za danna laar sham?" 
  },
  { 
    "english": "I respect your culture", 
    "urdu": "میں آپ کی ثقافت کی عزت کرتا ہوں", 
    "pashto": "زه ستاسو د کلتور درناوی کوم", 
    "pronunciation": "Za staso da kultur durnawi kawum" 
  },
  { 
    "english": "Is it okay to wear shorts here?", 
    "urdu": "کیا یہاں شارٹس پہننا ٹھیک ہے؟", 
    "pashto": "آیا دلته لنډې پتلون اغوستل سم دي؟", 
    "pronunciation": "Aya dalta lunde patlon aghostal sam di?" 
  },
  { 
    "english": "Can women travel alone here?", 
    "urdu": "کیا خواتین یہاں اکیلے سفر کر سکتی ہیں؟", 
    "pashto": "آیا دلته ښځې په ځانګړي توګه سفر کولی شي؟", 
    "pronunciation": "Aya dalta shdze pa dzangardi toga safar kawuli shi?" 
  },
  { 
    "english": "Where is the local mosque?", 
    "urdu": "مقامی مسجد کہاں ہے؟", 
    "pashto": "سيمه ايز جومات چېرې دی؟", 
    "pronunciation": "Simaiyz jumat chere day?" 
  },
  { 
    "english": "Can I visit tribal areas?", 
    "urdu": "کیا میں قبائلی علاقوں میں جا سکتا ہوں؟", 
    "pashto": "آیا زه قبايلو سيمو ته لاړ شم؟", 
    "pronunciation": "Aya za qabailo simo ta laar sham?" 
  },
  { 
    "english": "Is photography allowed?", 
    "urdu": "کیا تصویر لینا جائز ہے؟", 
    "pashto": "آیا د انځور اخيستل اجازه شته؟", 
    "pronunciation": "Aya da anzor akhistal ijaza shata?" 
  },
  { 
    "english": "Is this area safe at night?", 
    "urdu": "کیا یہ علاقہ رات کو محفوظ ہے؟", 
    "pashto": "آیا دا سيمه په شپه کې خوندي ده؟", 
    "pronunciation": "Aya da sima pa shpa ke khundi da?" 
  },
  { 
    "english": "Are there any cultural customs I should know?", 
    "urdu": "کیا کوئی ثقافتی روایات ہیں جو مجھے معلوم ہونی چاہئیں؟", 
    "pashto": "آیا کوم کلتوري رواجونه شته چې زه یې باید وپېژنم؟", 
    "pronunciation": "Aya kom kulturi rawajuna shata che ze yai baid paizhanam?" 
  },

  // ============ Adventure ============
  { 
    "english": "Is this a hiking trail?", 
    "urdu": "کیا یہ پیدل سفر کا راستہ ہے؟", 
    "pashto": "آیا دا د پياده سفر لار ده؟", 
    "pronunciation": "Aya da da pyada safar lar da?" 
  },
  { 
    "english": "How long is the hike?", 
    "urdu": "یہ پیدل سفر کتنا لمبا ہے؟", 
    "pashto": "دا پياده سفر څومره اوږد دی؟", 
    "pronunciation": "Da pyada safar tsomra oogd day?" 
  },
  { 
    "english": "Is it safe to swim here?", 
    "urdu": "کیا یہاں تیرنا محفوظ ہے؟", 
    "pashto": "آیا دلته لامبو وهل خوندي دي؟", 
    "pronunciation": "Aya dalta lambo wahal khundi di?" 
  },
  { 
    "english": "Are there wild animals?", 
    "urdu": "کیا یہاں جنگلی جانور ہیں؟", 
    "pashto": "آیا دلته وحشي حیوانات شته؟", 
    "pronunciation": "Aya dalta wahshi haywanat shata?" 
  },
  { 
    "english": "Where can I rent camping gear?", 
    "urdu": "کیمپنگ کا سامان کہاں سے ملے گا؟", 
    "pashto": "د کمپینګ وسایل چېرې کرې اخيستلی شم؟", 
    "pronunciation": "Da camping wasail chere kare akhistali sham?" 
  },

  // ============ Communication & Language ============
  { 
    "english": "Do you speak English?", 
    "urdu": "کیا آپ انگریزی بولتے ہیں؟", 
    "pashto": "آیا تاسو انګلیسي خبرې کولی شئ؟", 
    "pronunciation": "Aya taso English khabare kawuli shai?" 
  },
  { 
    "english": "Please speak slowly", 
    "urdu": "آہستہ بولیں", 
    "pashto": "مهرباني ورو ووايه", 
    "pronunciation": "Mehrabani wro wwaya" 
  },
  { 
    "english": "I don't understand", 
    "urdu": "میں نہیں سمجھا", 
    "pashto": "زه نه پوهیږم", 
    "pronunciation": "Za na pohigam" 
  },
  { 
    "english": "Can you write it down?", 
    "urdu": "کیا آپ لکھ سکتے ہیں؟", 
    "pashto": "آیا تاسو دا لیکلی شئ؟", 
    "pronunciation": "Aya taso da likali shai?" 
  },
  { 
    "english": "Where can I find a translator?", 
    "urdu": "میں مترجم کہاں سے ڈھونڈ سکتا ہوں؟", 
    "pashto": "ژباړن چېرې موندلی شم؟", 
    "pronunciation": "Zhabaran chere mondali sham?" 
  },

  // ============ Utilities & Technology ============
  { 
    "english": "Where can I charge my phone?", 
    "urdu": "میں اپنا فون کہاں چارج کر سکتا ہوں؟", 
    "pashto": "زما ټیلیفون چېرې چارجولی شم؟", 
    "pronunciation": "Zma telephone chere chargeawali sham?" 
  },
  { 
    "english": "Do you have Wi-Fi?", 
    "urdu": "کیا آپ کے پاس وائی فائی ہے؟", 
    "pashto": "آیا تاسو ته وای فای شته؟", 
    "pronunciation": "Aya taso ta WiFi shata?" 
  },
  { 
    "english": "What's the Wi-Fi password?", 
    "urdu": "وائی فائی کا پاس ورڈ کیا ہے؟", 
    "pashto": "د وای فای پاسورډ څه دی؟", 
    "pronunciation": "Da WiFi password tsah day?" 
  },
  { 
    "english": "Where can I get a local SIM card?", 
    "urdu": "میں مقامی سیم کارڈ کہاں سے لے سکتا ہوں؟", 
    "pashto": "سيمه ايز سیم کارت چېرې اخيستلی شم؟", 
    "pronunciation": "Simaiyz SIM card chere akhistali sham?" 
  },
  { 
    "english": "Is there mobile network here?", 
    "urdu": "کیا یہاں موبائل نیٹ ورک ہے؟", 
    "pashto": "آیا دلته موبایل شبکه شته؟", 
    "pronunciation": "Aya dalta mobile shabaka shata?" 
  },

  // ============ Money & Exchange ============
  { 
    "english": "Where is the ATM?", 
    "urdu": "اے ٹی ایم کہاں ہے؟", 
    "pashto": "اي ټي ايم چېرې دی؟", 
    "pronunciation": "ATM chere day?" 
  },
  { 
    "english": "Can I pay by card?", 
    "urdu": "کیا میں کارڈ سے ادائیگی کر سکتا ہوں؟", 
    "pashto": "آیا زه په کارډ ورکولی شم؟", 
    "pronunciation": "Aya za pa card warkawli sham?" 
  },
  { 
    "english": "Where can I exchange money?", 
    "urdu": "میں پیسے کہاں تبدیل کروا سکتا ہوں؟", 
    "pashto": "زما پیسې چېرې بدلولی شم؟", 
    "pronunciation": "Zma pese chere badalawali sham?" 
  },

  // ============ Pharmacy & Health ============
  { 
    "english": "Is there a pharmacy nearby?", 
    "urdu": "کیا قریب میں دوا خانہ ہے؟", 
    "pashto": "آیا نږدې درملتون شته؟", 
    "pronunciation": "Aya nizde darmaltun shata?" 
  },
  { 
    "english": "I need medicine for headache", 
    "urdu": "مجھے سر درد کی دوا چاہیے", 
    "pashto": "زما د سردرد درمل ضرورت دی", 
    "pronunciation": "Zama da sardard darmal zaroorat day" 
  },
  { 
    "english": "Is it safe to drink the water?", 
    "urdu": "کیا پانی پینا محفوظ ہے؟", 
    "pashto": "آیا د اوبو څښل خوندي دي؟", 
    "pronunciation": "Aya da obo tsakhal khundi di?" 
  },

  // ============ Transportation & Road Travel ============
  { 
    "english": "Is this road safe for tourists?", 
    "urdu": "کیا یہ سڑک سیاحوں کے لیے محفوظ ہے؟", 
    "pashto": "آیا دا لار د سياحانو لپاره خوندي ده؟", 
    "pronunciation": "Aya da lar da sayahano lapara khundi da?" 
  },
  { 
    "english": "Are there checkpoints ahead?", 
    "urdu": "کیا آگے چیک پوسٹس ہیں؟", 
    "pashto": "آیا مخکې چک پوائنټونه شته؟", 
    "pronunciation": "Aya mukhe check pointuna shata?" 
  },
  { 
    "english": "Can I hire a local guide?", 
    "urdu": "کیا میں مقامی گائیڈ کرائے پر لے سکتا ہوں؟", 
    "pashto": "آیا زه ځايي لارښود کرې اخيستلی شم؟", 
    "pronunciation": "Aya za zayee larshod kare akhistali sham?" 
  }
];

export default phrases;