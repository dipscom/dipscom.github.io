const data = {
  landing: [
    {
      button: 'Let\'s begin >',
      paragraphs: [
        {
          copy:'Once upon a time letter writing was an act of Love (or Desperation), a declaration of Folly (or pure Wit), a moment of Joy (or Disappointment).',
          key:'landing1'
        },
        {
          copy:'Today one can master this Art and improve one’s technique with the Penhaligon’s Portraits characters. Experts in affairs of the heart.',
          key:'landing2'
        }
      ],
      tagline:'And you could win a Portraits fragrance for you and your honey-love sugar-bee.',
      mobTagline:'One can master the art of (love) letter writing and improve one’s technique with the help of the Penhaligon’s Portraits characters.'
    },
    {
      button:'let\'s create some love >',
      paragraphs: [
        {
          copy:'Nonchalant composure or passionate desire, or maybe something else... Let Lord George or maybe Lady Blanche help you out with a little inspiration.',
          key:'intro1'
        },
        {
          copy:'Just a little information from you and they will become your personal scribe. Go on, who doesn\'t need a little help from their friends in affairs of the heart.',
          key:'intro2'
        }
      ],
      tagline:'Choose your suitor wisely...',
      mobTagline:'Just a little information from you and Lord George or maybe Lady Blanche will become your personal scribe.'
    }
  ],

  selector: {
    heading: 'Create your letter of love',
    // NOTE this has been set to accept HTML instead of plain text
    mobileHeading: 'Choose <span class="highlight">three characters</span> and tap to answer the questions',
    cta: {
      text: 'Choose three characters and answer the questions:'
    },
    button: 'CREATE LOVE - WRITE A LOVE LETTER',
    warning: 'Please select a more appropriate word'
  },


  letter: {
    previous: '< Edit',
    greeting: 'To my dearest',
    // NOTE this has been set to accept HTML instead of plain text
    signOff: 'With love from<br>Your secret admirer',
    button: 'Next >'
  },


  receiver: {
    heading: 'Who do you love?',
    nameToolTip: 'Please enter the recipient\'s name',
    emailToolTip: 'Please enter the recipient\'s email address',
    legals: 'Contact details for the recipient should only be provided with that person’s consent, and that person may be told who provided their details.',
    button: 'Next >',
    previous: '< Back'
  },


  sender: {
    heading: 'Who might they love? (And now\'s the time to find out!)',
    nameToolTip: 'Please enter your name',
    emailToolTip: 'Please enter your email address',
    button: 'Next >',
    previous: '< Back'
  },


  confirm: {
    heading: 'Confirm & send',
    subheading: 'no need for a post boy! We shall send your letter of love',
    confirmation: {
        prefix: '...to dearest',
        suffix: 'at the royal postal address of'
    },

    terms: {
      paragraphs: [
        {
          copy: 'Be in with a chance of winning two Portraits of you choice. <a href="https://www.penhaligons.com/love-letter/" target="_blank">Terms & Conditions apply</a>.'
        }
      ],
      consent: 'I would love to join the very Penhaligon’s club and discover our online secrets via our email newsletter. You can unsubscribe at any time.',
      legals: {
        copy: 'By clicking ‘Send Now’ you agree to the Terms of use,',
        choices: [
          {
            name: 'Terms of use',
            url: 'https://www.penhaligons.com/terms-of-use/'
          },
          {
            name: 'Privacy Policy',
            url: 'https://www.penhaligons.com/privacy-policy/'
          },
          {
            name: 'Cookie Policy',
            url: 'https://www.penhaligons.com/cookie-policy/'
          },
        ]
      }
    },

    legal: {
      text: '',
      url: '',
    },
    button: 'Send now',
    previous: '< Back'
  },


  thankYou: {
    heading: 'Congratulations',
    subheading: 'Your letter of love has been sent',
  },


  promo: {
    // NOTE this has been set to accept HTML instead of plain text
    heading:'Why not match one of our <span class="highlight">Portrait fragrances</span> to your letter of love?',
    cta: {
      text: 'Alternatively you can find your perfect Penhaligon’s scent with our online',
      url: '#',
      productName: 'Fragrance Profiling Experience'
    }
  },


  valentine: {
    heading: 'Dear',
    tagline: 'Oh, what could be more romantic!<br><span class="highlight">A secret admirer</span> has sent you a Penhaligon’s letter of love.',
    button: 'Open your letter & find who sent it',
  },


  valentineLetter: {
    greeting: 'To my dearest',
    signOff: 'With love from',
    reveal: 'Reveal their identity',
    button: 'Win Penhaligon\'s portraits >'
  },


  share: {
    heading: 'Share this experience with your friends...',
    tagline: 'Be in with a chance to win the full Penhaligon’s portraits collection. Plus join the very Penhaligon’s club and discover our online secrets',
    legal: {
      text: 'I agree with the Terms and Conditions/Privacy Policy',
      url: 'https://www.penhaligons.com/love-letter/'
    },
    social: [
      {
        name: 'Twitter',
        src: './imgs/social-icons/twitter.svg',
        url: 'https://twitter.com/PenhaligonsLtd'
      },
      {
        name: 'Facebook',
        src: './imgs/social-icons/facebook.svg',
        url: 'https://www.facebook.com/Penhaligons'
      }
    ],
    cta: {
      text: 'www.penhaligons.com',
      url: 'https://www.penhaligons.com/'
    }
  }
}



const perfumes = [
  {
    name: 'Lady Blanche',
    tagline: 'Charmingly Traditional',
    imgSrc: './imgs/promo/ladyblanche.png',
    clickUrl: 'https://www.penhaligons.com/the-revenge-of-lady-blanche-eau-de-parfum/'
  },
  {
    name: 'Lord George',
    tagline: 'Masculine & Elegant',
    imgSrc: './imgs/promo/LordGeorge.png',
    clickUrl: 'https://www.penhaligons.com/the-tragedy-of-lord-george-eau-de-parfum/'
  },
  {
    name: 'Duchess Rose',
    tagline: 'Oh heavenly joy',
    imgSrc: './imgs/promo/duchessRose.png',
    clickUrl: 'https://www.penhaligons.com/the-coveted-duchess-rose-eau-de-parfum/'
  },
]



const characters = [
  {
    name: 'Dorothea',
    tagline: 'Impeccably well-mannered',
    question: 'What word would you use to describe your loved one?',
    hints: 'Hints : Strong, Beautiful, Handsome',
    avatar: './imgs/characters/avatars/dorothea.png',
    portrait: './imgs/characters/portraits/dorothea.jpg',
    prefix: 'If I’m asked to describe my vision of perfection. Well it is you my love. You are so',
    suffix: 'I feel my pulse hastening when you appear in my mind. It’s truly pleasant. May I thank you?'
  },
  {
    name: 'Sohan',
    tagline: 'Well Travelled',
    question: 'Where did you first meet?',
    hints: 'Hints : India, London, The swimming pool',
    avatar: './imgs/characters/avatars/sohan.png',
    portrait: './imgs/characters/portraits/sohan.jpg',
    prefix: 'I remember our first meeting in',
    suffix: 'as if it were yesterday. The first time I laid my eyes upon you was a joyous day as you are in every way perfect to me.'
  },
  {
    name: 'Lady Blanche',
    tagline: 'Charmingly Traditional',
    question: 'What is your lover\'s best virtue?',
    hints: 'Hints : Honor, Courage, Compassion',
    avatar: './imgs/characters/avatars/blanche.png',
    portrait: './imgs/characters/portraits/blanche.jpg',
    prefix: 'It is only you whom I don’t mind losing sleep for. It is only you who I can never tire of talking to. Your',
    suffix: 'knows no bounds and touches me in a way no other can.'
  },
  {
    name: 'Monsieur Beauregard',
    tagline: 'Suave and sophisticated',
    question: 'What colour are their eyes?',
    hints: 'Hints : Brown, Blue, Green',
    avatar: './imgs/characters/avatars/beauregard.png',
    portrait: './imgs/characters/portraits/beauregard.jpg',
    prefix: 'Oh Amour! The',
    suffix: 'colour of your eyes is as intense as my love. As wanderlust as my passionate intentions. As strong as my embrace.'
  },
  {
    name: 'Yasmin',
    tagline: 'The Future',
    question: 'Where would you like to holiday together?',
    hints: 'Hints : Japan, Peru, Africa',
    avatar: './imgs/characters/avatars/yasmine.png',
    portrait: './imgs/characters/portraits/yasmine.jpg',
    prefix: 'I have a longing that only you truly understand, to see and taste and touch so much of this life, a burning curiosity, and with you by my side I can feel it all is suddenly within reach. Darling, what say you to an exotic escape? What say you to finding paradise? What say you to',
    suffix: '?'
  },
  {
    name: 'Lord George',
    tagline: 'Masculine & Elegant',
    question: 'What is their favourite tipple?',
    hints: 'Hints : Martini, beer, white wine',
    avatar: './imgs/characters/avatars/george.png',
    portrait: './imgs/characters/portraits/george.jpg',
    prefix: 'You know, I just knew we’d hit it off - although I admit I had no idea quite how well !!! - the moment I saw you order a',
    suffix: '. A person of taste I said to myself. Maybe they’d be good enough to extend their good taste to include me?'
  }
]
