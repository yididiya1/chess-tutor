import Link from "next/link";
// import {  BookOpen, Swords, Crown, Users, BarChart3, FileText, Target } from "lucide-react";
import UserDashboard from "./components/UserDashboard";
import ContinueLearning from "./components/ContinueLearning";
// import UserWelcome from "./components/UserWelcome";
import Image from "next/image";

const practiceCards = [
  {
    title: "Do Puzzle",
    description: "Solve tactical puzzles to improve your pattern recognition",
    icon: <Image height={100} width={100} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABvUlEQVR4nO2ZQUsbURDHH9UexYK39trUU+nBe4VSamYWNQcL1uarlNyKmdnUW4sX70aCx4KCSWZiaCAfRaEpaD018gIGaUuytG+Tt/p+8O7/387sm2XWmMAdhCW/QYLKij9Z4IIFTljzqyYLkMInVuz/fkjwFyl8MD4TCxT+Fv62BDfhlfEVEqiPEhhIKB4aXyHB3lgBwZ7xFRY4S1CBK+MrJHg0XgBOja/Egu8StFDR+AoJFscJ2BkxlXDl1soiK3wdDKZxIf/1CPwggVq5EeWchq804DkJXKYWXP9os/NKO3riTMC+eJMKz0MJ2HcSvtxamxtM0AkLsOJ3VwKPpxC+b08QsIQKaGih/yO0kE65hXa7Sw/tVyYJfqlo9KJUX57dqa8/Yok2WaHj/TU6CitjxTIrMJRQ+JZZAQspbGVaoNyIckFAp1iBuJV/n9kKVKtvZ0ihm0mBUr/0gBU/e3+NkkCNFPe4iS+3j1/Pf+wUFuJWtMYC7bTCs0uBNENyEEhAqICGFrrnLUQJ9v7e7oVu5sCkBUjxwLgiFniW5OeF293om6fGJXbZaveVabYTCfbsk3cePhAIBExaXAPD1I4+P8jeGwAAAABJRU5ErkJggg==" alt="puzzle"></Image>,
    href: "/puzzles",
    color: "bg-none"
  },
  {
    title: "Learning Opening",
    description: "Master chess openings with interactive lessons",
    icon: <Image height={100} width={100}  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACx0lEQVR4nO1YzU/TYBivF0/Gf8Zo9A/wpOfNixASZ0LUePKk2w4EokhM9OBHiEaJSpjgnGyY4ca2ZrOd64CEMYiGm9q+LbSabkHY5mOeF0dQPrZBVd7k/SW/pHnb/T72PL1UEDg4ODiYBtw854LrnosCq4BeTwRueNIAwgFhv2EuLx+xDAJLRPuxRNTvJtEMk6jzlqEll+OBfOWh9zP0egBZu3VhHvo6LzfSBCgc/LqoHjMXSZupa37T0B6ZOgmipqlrs6aukSWiLptEq6E3Zth9gZz8AEW2Ymk6DSsv7gD0nqcFVgO3wc7GVi1DS5kGOYtBN4bGs1/3lrfTtLZgUZHu7yp8oZA4VFSkb40MVl7eg8qT7k3nJlGVupapa9lWQlsbOJeT7Q+yfLip0D63CHUO9GRgTpEbGpSmRChL0a3NFbkpDWunAooMAz3p9VzIpgpkwpIj5k5oZMJS6wWcMndKw8cLGHwCwFfIvU9f4pIYAltJMvgS6xrY2bdQ7W6HSl8n2JMiYwXIFyjHh6Dmd0O1p51Ogq0CxhrL8QCdBHsrZNQnodJ1YreA0ViDF7Aa/FOlXAzsGZnFCWhgT6eh2n8VKo+7wC68Z6wAUaH8bgxqd69Atf8anQRbBYw1lqU3dBIMrhBZo67SdWK3gLG9OS+g8AkQNlcon4xBLPAUJoafQSI4BOLrYciMhSA7HgElMQ5TYgKKOQkWZqbh08JH/ILXsAA+g8/ib4o5iWqgFmqiNnqgF3qi92QqtrsCs9kMJEYGqUizjA8/B3k8QsNh0HoBvMYzvIfPtKI5MTJIs7T+XSjyqiWjPylHI+sF5Gh4T1qZcLD1Anthx4lRaDsa+o0dx0cd0fb9iwKXTkY3FcAzZgp4XSkaGCeBxGs8++sFnIDPlerewbxLYAF+t3ja5xYnvG7RpnSJce+Z1Kn/nYuDg4NDcBw/ASB+h8vANstgAAAAAElFTkSuQmCC" alt="story-book"></Image>,
    href: "/openings",
    color: "bg-none"
  },
  {
    title: "Opening Traps",
    description: "Learn deadly opening traps to catch your opponents",
    icon: <Image height={100} width={100}  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFbklEQVR4nO2Z609aZxjA+dIvpvu0pNt/sGb/Q4fth27J0mR/Q7XU69bVuYKlpbrOe2rjlEidl3S2eg6CXA4ItCDgAZSLK5Mp4AXsarzM+rEfuqXP8qIgchHhnAMc5pM8CdHkhd/vPO/tORzOWZwFI+GW1F009VZ7tN2V74nOig+67hvvzH01UyoJr4xT6mEdqP9K2135j6r9OiSmoYe37xgUfMIp1bCIa7/UdlX+Gw+t7qgA4+MqsA3Ug1VcB5b+2jczIz98yvk/wOsf8cD3rBGCuOBYLo/fcSwrGj/ilEqQ/fVXE+ENPTzwT9xJgj9KPlkSEsic4EtEAnkCfABrAk3nbXh+vxY0XbchOFFiEsgT4P1YE6jabsFvd6tjqWy9VToSyAzwygT4MWENKNsawNovgCDGcglklk/+mbAGTL33wPHkp0h6Rh6wVwJJEZ7VEkia4FkpgaQZnlUSSIbgWSGBZBi+qCWQeYIvSglknuGLSgJZIPiikEAWGL6gEsgigS+IBLek7mJiG8vQcxOWD291+YaP5sKoKP1VGuNbfbjoPC0CTL3VnmKDRzn3pOWEKqBRwnRX5fv4NhaCR1+A7vOJ8MZeYV7gUbqGmzM3VeiQQHRUfIg2MON7eKiZUSh451Az+CeaTtFVokGCrvvGOyQAdW/jB0adnOh9ngp8d/PPYOh7mPb/9sFWMD+VgO3Xjuzh6ZBgRi8t2q+DbaDu2KBoDVC2fR9pZlB5mi/FD6HlXnoJBkwKCo0TFMQ86OQacMnEEJDezU4AFQkqCa8MvbSYFdcmDYokWPoFlEs6pYShNnDqCbBrNaDWOA4kHOYLFZG9ACoSbOKGC+b+mo1UgwbwJlgYeUC7hHnZU3Avhg7yjzXwOObAangJSmIOZpTy3ARQOSfYxA0XlrEfLUxKQPAtonYgJjWgndKBWW8G1++BmAjP4hr4ZS0U4ClK2FSJygI43xQ/2PafFljX9dAnYfARKDTzsXJXaRxg1OphwTYD3lk9BPAc5j+TEtZU7bC/FYKQ7jFlCS4rGSl3m9kGejUqd3tMhFveRxN4PiSMirICP9jqBsBptR/N+8UQOF+tgEMrBbtiNLeVny0SDNjkYbnPgUlvAbfdAR7vakSCSqGG2WEhQ/AUJfhw0Xm0teQsYagN5nVqsBFEZK7Hb3UmQgNLml/AOy6E1uYWsA4zVQGxNLolvHPUJagPJKxP92SUMC8fi9vqVsFlt4PFYDzc6mSxH+d93pRRQlheFUmKEr7LWkA6CRumwcjnEyUMtYPTaAS3d+XYnu+fTN7qohJSTYewrAreaq/A3vRlCMtv5iwggAvcnFzDlyAB5d7GUsZKQGf7AH4ffPpheOWwgJc0QFCa+qyfSgJ66gj87XR5JP/WXoUVKT9XAfs5C0i3JoRfiNNWQgQ+y4tNvIREeJRb6m+oTIEAh2r4UlRCLDFBRAJqZqD7fNa3ujgJ0r5vk+BR7mmvQEhWB6vSRliXHb/AZU5+J2UBGSUciqCyWEXnfCJ8kozpyxA65cIYwPjhJTn/Yw5dsZni2ExHhuTVMfgddTm8nuRSlhDA+dtBXPA5bfBMSYiHR7lLcOHNVLKAXaIctlXcU0lgDJ5uCakWvHS5Mn4J/GOXIhUS/ds2cS3/8HRKQPP+tAL+muJCCP8C9rQHVbBLfA0r0sbCwBdKwtF0KAJ4piVsKrmwQxQ5PJMSXsu4sKXkFj98vqYDgl8tVnimJbACnikJrIKnW8IOcY198Ewem1kDz4QE1sHTKYG18HRIYD08FQklA5+LhJKDz0ZCycIfa6/hAmNKeIwfXsaFn3FKPdwS3jn00iKI8V2odY26t6iBSWsP7yzOghMf/wEmoAfEcRli7gAAAABJRU5ErkJggg==" alt="external-Pest-Trap-pest-control-icongeek26-flat-icongeek26"></Image>,
    href: "/traps",
    color: "bg-none"
  },
  {
    title: "Practice Middle Game",
    description: "Improve your middle game strategy and tactics",
    icon: <Image height={100} width={100} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACV0lEQVR4nO2Xv2sUURDHn79BBO1FsBEPRBFTiCicJDNeQCtxyc4cGL2Z7IGgIP4Blz9ANKQTCwsrRRDURhuRnMUFQVKkEBs7FTGSYFTwx8p6qDkvkbuX3X27sB+Y7li+nzdz83jGFBQUFKzAGqzqKWSdMXmj7J3bgqwPkDWMyuSJRqOxFlgf/Q6fOwFgHVsaPlcCwMFeYH37rwCSTCPJ1Uo1OGCySMXXPcB6ryv4MjVUlaMmS4CvBCSLvYRvd0Mfm6yALBd6Dt4pcTlas8ZpeD84CKzfrARYQ2C9ORAEG5wJAGvLNvwfCZL7TiSAgiOrDb9E4kbq4wSkV+ISwPaaHU9boBmnAJB8R5bDKQpI92W1cn3q7XcylZ4Ay5cew8+UR0e3Iet1YHkHpPNI8gJYPnZuJJlDGvNTE0DSzz0K/EDW/V0H4AVbkeUikr4C0oeDp+vbUwv/S4D1dR/7/tnw8PlNy31noL1C07/QkHS2vz+qTJosgSy3+t40LCdNVgCWS/3vev1QGanvNFkAqL7Lbt9r0/O8dSYLYPRIsZFgbZgsACxsd/PK10Ff9rnOb8rlxnogfWk5Sk+cvwcigOSsXRc0jF5yxjWe521E1jd2XZDnJgsgy4RtF4aodsh1fgN+7bj1GLFec53fRJeTrQCSzrrOb04EwWbrDpAsOg0ftkpPw+lSuOpqlZquBJoxCUylGvzYyJkdyHIHSBes57/zYlsA1ruVam13KuGB9X0cwbFrK8lc9P1EBaKTTyI8/q3biQrENTb/Gaf5RAUSPv0wqkKgoKDA5Iaf6A7fJNtGUIgAAAAASUVORK5CYII=" alt="knight"></Image>,
    href: "/middlegame",
    color: "bg-none"
  },
  {
    title: "Practice End Game",
    description: "Master endgame techniques and positions",
    icon: <Image height={100} width={100} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADw0lEQVR4nO3WX2hTVxwH8AN7GzJp/jRJm3/33HOjSZs0yW1uknu7hz2IOhX8V4T5MhEU9MlH9XZd/zi7ObXVtjaJf6YmbZY1y61sQxH6MME++Qd9aKWgPihM0OK6IWjB37gplLVjadLlpofRL/yeLoTP996Tcw5CK1kJXcHZaDXJSZ1Eke6RnPinOlxOuktyYof6DNEcMtLUTHLSND+6AdY93A2bHu2B8K3NwClSftRnRInuRLTiuZz0XhrbBlsm987NJ3d2zRXIT056T7KUlcCzy2Y6OLphHl6dwOj6eQXIjyKww9HfSabJiGiJuuZVnPq2/44Xx7b+A0+Go8BmosCkI+2IlhBFvK8ChV+3wKcTn8O6B59BcHTjv+JxOgJMSriLaAlRxD/mrfMFsxCPB8PgTIamES3hFOl1KXgmKYDjcug1oiXqPl8K3nklBI5LjXcQLSGK+EWJeLCf52VES5iRsIko0qui8YngS9zvo+tU5kak7SQnziz+5oMz1hi/FdEYkhVjiywbsA4EBxBtsf/UVFUM3hYLgrXfD7W9voy5x0/HScwp0U1sNvq8eHwD1PT4wHKq/oX5m7ody+1HbFZ8UjreC+YTdVB93PN4uf2IDEeGloI3dXnA2OkeWm4/ImkpshR89TE3GNtcEqIp9uzHFvVrsN9HgFVLDYXzxXBqthyTLxcyI1rDpiPBQnjn5XwBP6I1TDq8ozC+ERwXA9sRrcHpsFwYz9N1B1oYPCjcLIi/wIM9HriBaAzO8KtxSnhTEJ8Igi3uf4Nj/GpEW5hB4eDi+ADYBgJgPec/gGiK5Rr/IU4JT4vEq3ehZ8ZezypES5hkeKBYvLWvIX+w1Z7xnkM0BCfDcsn4sz6o6fGC+bR3GXekTPMHOCn0LRVv6faqN1IwfevpU3+ronZyVfgIp4SR/4o3n6ybvRt97b5uP+6tqgjemYw6mJQwWT68B0xdbqg+tnbS3OF2aL7Xa4L/yg3GzrVgaHdNVnVh7c4InBLiWuGN7WvA0OYCfasrrgmeHWq0Oa+GZrTEG1pdoJfJTNVR1lb2AkxSOKQ5voXLj04mh8pewHkllK0EXj87P5S9gOO70ESF8KCTyXj5C1ziX1UCr88PeVn2AvYL/NvK4Dn1j/y27AVsCX6/LREY1xqvk8m4oYXbh7SKJcbba/v9zbW93iM1vQ2JmrO+Xyzd9WPm7voJy6m6F6aTninTCc+Uqcv9bg7fseadsc01ZfiSm9K3un5TkXqZu61rIT/rZBLXydxhnUx2arJ9rmQl//P8Bdn0A3Cn2AedAAAAAElFTkSuQmCC" alt="chess-com"></Image>,
    href: "/endgame",
    color: "bg-none"
  },
  {
    title: "Puzzle Challenge with Friend",
    description: "Compete with friends in puzzle solving challenges",
    icon: <Image height={100} width={100} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD0klEQVR4nO2YW2wUZRiGP0gTuDHlpMygcGEI4cIbNZoYA00IiRBmWmoDQavxhhRNJZXDzC4hagyUILZWTWNLQIsRKklpWLbZ+aeLpeoNlHKafwaIRvGAEWgI8YDWWPUlM7S4M90ps8yOgTBv8mWT3Zl33if/N///ZYlixYoVK1asWLFiBRc7vZB0K+F8FkGCwstEhScE1VhMkYtZG0i3kFOrw9iJilEnqhw3KsGTFJmAccTMyx6A82EsBYWfzwUQFH6FIgXQzV/dAOZPYSxFhQ+4VkA1fqFIpZufelagM4ydoPIDbgDOqKjSraOewGMXM4/4WYmq0e8JG6wU3hcGAAWXL8AthFevVwxAd9oKQK+YCU1uvV1aCJrcCm3RA8HC95ZNhCafBZNx2wAw2a4zdrabA2jSluEbRoUbr5tYp7cgrSdRpnf5A/T2ltDrGD8KQOFDomL84w1YtSWFg7tVvNH8Pu5XDT8A2NluEr78YWjyUD6Ae/U+ZNkaoP814Nx+DBx6yW8VPiPd/JOY9TPp5sbcmWf26q8mTE4cKxUVvjk34JXsi44njr6Kz/eswUMbD/sAyEN2Rr/WKQGTTty4mMmoZ41OqCdZBj+y6uvf91QDZ7bjy2xtsJbqthbkbSmF94wE/DZd63g63kzGhVQ1yuu7nN/ebWn4D8Ap6YSddTQAkze4L/SvwUwFHu9oD/hemK/kAxAU3jQCsEDtxB9dSwM9e7iV3EMfdGkuNHkwqMHzbZuCnsz/Ejs9L896jxNU/kVum6xKvlUAgDxoZx7ue6m9kPANu2pBqb4xQlt7iVk/ELO+IWauHIk8Qz21YsZac+Z9Sf6goPId3hd1el0/3tu8vjAITWq3WyfwTdm9L6Bk577IttFpzzF0t9QEh7A3mqAXnkstx9SGd0CZU9GdA+tPYlbVLnzd/kxxAS6kqzBnWz1odzbyg2zayl48sqIZFzuXhQe4mlmKto9rIG59E/T2B/aO8r+cxKWV+zCnajv2NL6M39OVhQBIf0OTj4FJW8HKF06sbwRtagJtawEdGOPFLTLA9Lp+lEqf4J6nPsLkxW1A95JHockJaNJBaNJfbgB77tHkZmhLKrG/YpLrqU0fXqLWDlD6eNBts8cfwDhUEMTa45jybAaTnu4cyPWxMzpZnczyWSpIzMp6AndQCAkKT7mCK1yjyGQPZ8y66tnzL4axFBTjshvA+I2i/VfCGvCswPdhLEXV+C4XwAaiSGXPNbljQrdVE8ZOUPkqd+8beeem4orxJ5zg9mcRJCTNx0SF1wgJY34x/GLFihUr1t2lazBwk6UAF1X5AAAAAElFTkSuQmCC" alt="puzzle-matching"></Image>,
    href: "/challenge",
    color: "bg-none"
  },
  {
    title: "Analysis Board",
    description: "Analyze positions and explore variations",
    icon:<Image width={100} height={100} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA1CAYAAADh5qNwAAAACXBIWXMAAAsTAAALEwEAmpwYAAADhklEQVR4nO2az2vaYBjHBU1MWn8k/kpSmxi1q7aizKIWtkPHxtqsV3EdjLKr0J0E70Z37HC0O++0ewdlXcfW7Tbo36CFHnZuj2W7PCPZL61539Z2oNNX+BwkfPH5+j7vG+PztdnG4WW321cpmn1P0ewRRTNfhxf2iKLZfbvdruH8TFI089knqKdz+RXI3nk49CTzK8ALyilFMwdG/T2OKJr5FEkufh90oVdBSRa+UTTz8XzTaT4hcjLo4q4DH1JObDb7cscqsfvnW854ryRyIM/2Mn1jAUQ1ZXntN2JkDntdiMzj9WrK/Byra0oiZ9bX1Yq5ZaCc7NtOU+3sUqnLUCw+A3Vdh2eNRg+P1taAkxcgVXqJxO8PQKPRQMJ6RaxelOPwdGPD8vPrug7RWLzb2FIJHDTb7jR13Ok6kixArVaDdqtlydbWFkxli6A1z5AoERWpN5jkw1h9OJ6B3d1dpL5Wq5l1dtZt+MCaMr6NYTZV13ViCshKNUn7wcD2lJLIQbFYhOebm5asr6+DV16AzONXSHx+P1Jv4Jz04/WiApVKBakvFotmnZc2JUXT4JWz5glnBa8ugiCIoGmrSByMG6k34Dgeq3f7JAgm7iH1XjkLUizd35E+X9pGtsbNJ69Be7CKPbJdwTi2vYKChNUrMxm4XT1E6udL2/0f6cRUi6wUkPZrkj11PF4HhaSmzPvI9LRsSSAQBIfTBRN+FQnDski9AT3BY/UeLw+CICD1HMebdfb56FEf8keP+lUePYgpICvVIu0HZE+N1UEhqSlgPCHzvzkrnK6AeZ8IBEJIGJcfqTfgfEGs3s0FgPEISD3jCfV/nxq5XxQRYqpFVkoj7XdI9hQ1dgeFFE1DKByDqVjakuBUFFy8CHI8jcTL+yEcyyBxc0Gs3s0JICqzyBpC4ZhZ56VNyYkclMtleLOzY0m1WoVA4i7cqnxBIkoSUm/AchJWL6lJeNFsIvXlctmsk8yn6mTodkYmiW0yHm39u5nvKEzn2905Cs3MKeg1dI7CmA+lSttIjKFbo15H8jNHgdbjchR6TQc1Goe5gtaVozB8/DXFsO+SPYkXDZREHpl4kS5MvFyQaLlW4iVv1odNvNhs9hU+NBLZpPvnU2QHyv+aIksUvjlo5oMNkfc7MFbMWMpBF3oZkrllc4V+GZqwMvWnFSmG3TM23ZAnM9uUk93risON8usHeu9R83hag4IAAAAASUVORK5CYII=" alt="external-Game-Board-sports-and-recreation-vectorslab-outline-color-vectorslab"></Image>,
    href: "/analysis",
    color: "bg-none"
  },
  {
    title: "Game Review",
    description: "Review and analyze your completed games",
    icon: <Image width={100} height={100} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEXUlEQVR4nO2Z628UVRTAN9Fvwn/BltrSAgFNQCU8Umj6SlQwREpia9QIYmmb9d611ta5s2DTIOpiNAGpDV2trRKjfCCGUgtbExOkIpY/QD5SSYCYuNy5c8yZbWvnfeexxYQ9yUmamem985vzvGcTibKUpSxleWilQJS1GmVdGlXHNMKuccpuc8ruz+ttjaq/Fe8pnfhs4v8kkBpYqZFMN6fqDY2qEEQ5YbMIDn19Kx4cQF/fo/hlOVX/CgrgADSnUfUwrrm8EOlMpUbYTFQAB70KKWX1skBwqrRwot6TeTHx2T7QJ9aCfrHG+FvKOpTd5URtLimERtl+TlQuBXHqBdCnV5kUr8m5mso1kmktpSXkID58FfR80gaC18Tx16RhOFWaYoWAlJJEk0v5eX8P6JPVdogF/anaeEYS5h7GY4zZST6wxXidO8SCi43XyScAwn6NJZthipWGGHzDF2IRZvBgABilI5o1ugcf41S9JQ3y/dPyID88FajOQGpgZQRrZLo9N3m3F0S2HcRIE4hzm6UhFmHObQaRawZxot1YS/MEYl2hQRzbjrffA/HJS8Wvn68I/PKumq8w1sS1cQ8Hq8xGaAAtrvPRK6BfWBffy7vphXXGXtb9C+nMmshuJT543bk2lErzSRDHDkQPeqPdXgoy0rR8ENPzMTTSbK0ro2FAfjeBnNzru/F0dj20bdoFh3duh5tnq2z3//z2ceio2wFtm3bCz1l/FxUn91prykxgkPnW+r9FentBn1zjufGLG3fBjeEaGOt5Egb2b7Hdf7/1GRh/5wmY/aIGWjfWe4NMVtsyGZaCECBqwRbs2XbPzX/5tPiV/56ogOtDNbb7eA3vLX3W1Rofv2zPXJT9EwuIAZNrlPJv7XIS7v642qT3L0nGRq7JuTCGA7G41oKmFal+6trntdCQbDTp1PH1/hDf7AAtzVxAQriWNdjNRVEBcXarr0X692xdhEg1bIPClHf6Ft9tcSyGkYLdmn5tLna0y//r5otxMXOq1gDzff5ol0/PFSr9GmMddxCfwA+jItvu10C+GRikkM7Uei56enf8IKe9j8KFt5TqwCCGVQi77mqRXPyVXuTMlTyWptHPvcRoffwgo/Uega50luRgJb5qiB/ky0Y3a8xFnkbiBDCSa03UFlUGZMS5EGqEHYoEsTh8oOpVG8iZFu8Xm6oEMfwcaD39horhZ0G/VOkNcqbFCeQK7Bl7JDKIAUOPrOJEvWMCOdHmagExtNv56IpH46HnXS0kLOk31nHQguAY0zSgw1YF42SyCvTzG4pnbzwIubQXJsX/PXageMY5v8FYA9fS0spSCM6J2pgoheAYU3baGEW5sQfblyil4BhTeuoYDuJOySxhFaBHKnACWAKQKzieXRYIyw89Ha7tfhArYK0i7FBs2Skk0Ir5DuCPwBDYAhGl84H+9OYk2NQZVqLsazw74M9yeNIsKpszrhF1FJ+BdKbKcZGylKUsZXko5F9vJVr5axIsiwAAAABJRU5ErkJggg==" alt="rating"></Image>,
    href: "/review",
    color: "bg-none"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-gray-500 bg-center bg-no-repeat opacity-100"
        // style={{
        //   backgroundImage: "url('/chess_bg.jpg')"
        // }}
      />
      
      {/* Content */}
      <div className="relative z-10 bg-black/70 backdrop-blur-[2px] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          {/* User Welcome Section */}
          {/* <UserWelcome /> */}
          
          {/* Main Content Layout - Three Columns */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* User Dashboard - Left Side */}
            <div className="xl:col-span-3">
              <UserDashboard />
            </div>
            
            {/* Practice Cards Grid - Center */}
            <div className="xl:col-span-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {practiceCards.map((card, index) => {
                  const IconComponent = card.icon;
                  return (
                    <Link
                      key={index}
                      href={card.href}
                      className="group block bg-[#3b3b3b] backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-700/40 hover:bg-gray-800/70 hover:border-gray-600/60"
                    >
                      <div className="p-6">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${card.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          {IconComponent}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">
                          {card.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Continue Learning - Right Side */}
            <div className="xl:col-span-3 bg-[#1f1f1f] p-6 backdrop-blur-sm rounded-lg shadow-md border border-gray-700/50">
              <ContinueLearning />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
