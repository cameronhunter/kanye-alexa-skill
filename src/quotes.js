export const Type = {
  Tweet: 0,
  Text: 1
};

const tweet = (id) => ({ type: Type.Tweet, id });
const text = (text) => ({ type: Type.Text, text });

export default {
  crazy: [
    tweet('702564264008159233'),
    tweet('699503963595472897')
  ],

  funny: [
    tweet('27590685489')
  ],

  greatest: [
    text('I still think I am the greatest.')
  ],

  love: [
    text('I love Kanye as much as Kanye loves Kanye')
  ],

  loveme: [
    tweet('715370821368283136')
  ],

  movie: [
    tweet('703600011884498945')
  ],

  // From https://en.wikiquote.org/wiki/Kanye_West
  quotes: [
    text('I am Warhol. I am the number 1 most impactful artist of our generation. I am Shakespeare in the flesh. Walt Disney. Nike. Google.'),
    text('I ain\'t no muthafuckin celebrity. I ain\'t runnin\' for office. I ain\'t kissin\' nobody\'s muthafuckin babies. I drop your baby and you muthafuckin sue me and shit.'),
    text('The music and the clothing are just as important. That\'s what makes you hiphop. You show people that you\'re hiphop by what you wear.'),
    text('You ain\'t got the answers Sway!'),
    text('I hate when I\'m on a flight and I wake up with a water bottle next to me like oh great now I gotta be responsible for this water bottle'),
    text('I still think I am the greatest.'),
    text('Ya\'ll might as well get the music ready \'cause this is gonna take a while. When I had my accident, I found out at that moment, nothing in life is promised except death. If you have the opportunity to play this game called life, you have to appreciate every moment. A lot of people don\'t appreciate their moment until it\'s passed. And then you got to tell those Al Bundy stories: \'You remember when I...\' Right now, it\'s my time and my moment, thanks to the fans, thanks to the accident, thanks to God, thanks to Roc-A-Fella, Jay-Z, Dame Dash, G, my mother, Rhymefest, everyone that\'s helped me. And I plan to celebrate and scream and pop champagne every chance I get, \'cause I\'m at the Grammy\'s baby! I know everybody asked me the question, they wanted to know, \'What, Kan, I know he\'s gonna wile out, I know he\'s gonna do something crazy.\' Everybody wanted to know what I would do, if I didn\'t win... I guess we\'ll never know!'),
    text('Yo, Taylor, I\'m really happy for you, I\'ma let you finish, but Beyoncé had one of the best videos of all time! One of the best videos of all time!'),
    text('Know your worth! People always act like they\'re doing more for you than you\'re doing for them. Ask yourself this question, "Why would they do that?" Obviously, you bring something to the table for them to even do business with you'),
    text('Would you believe in what you believe in if you were the only one who believed it?'),
    text('I refuse to accept other people\'s ideas of happiness for me. As if there\'s a "one size fits all" standard for happiness'),
    text('I\'m just giving of my body on the stage and putting my life at risk, literally. And I think about it. I think about my family and I\'m like, wow, this is like being a police officer or something, in war or something.'),
    text('I open the debate… The 2nd verse of New Slaves is the best rap verse of all time… meaning… OF ALL TIME IN THE HISTORY OF RAP MUSIC, PERIOD')
  ],

  style: [
    tweet('707705291056541697')
  ]
};
