"use server";

import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import { createClient } from "@/utils/supabase/server";
// import { createOrRetrieveCustomer } from "@/utils/supabase/admin";
import {
  getURL,
  getErrorRedirect,
  calculateTrialEndUnixTimestamp,
} from "@/utils/helpers";
import { Tables } from "@/types_db";
import { json } from "stream/consumers";

type Price = Tables<"prices">;

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

const inputList = `Abercrombie,Kim,B,1226 Shoe St.,Scottsdale,AZ,85256
Abolrous,Hazem,E,1399 Firestone Drive,Yuma,AZ,85364
Adams,Angel,C,6872 Thornwood Dr.,Yuma,AZ,85364
Adams,Edward,C,10203 Acorn Avenue,Yuma,AZ,85364
Adams,Gabriella,K,1902 Santa Cruz,Yuma,AZ,85364
Adams,Jason,C,1285 Greenbrier Street,Yuma,AZ,85364
Adams,Kaitlyn,A,1356 Grove Way,Phoenix,AZ,85004
Adams,Robert,Q,1411 RaAZh Drive,Phoenix,AZ,85004
Adams,Thomas,C,1220 Bradford Way,Phoenix,AZ,85004
Akers,Kim,C,1619 Stillman Court,Phoenix,AZ,85004
Alan,Cheryl,L,1064 Slow Creek Road,Phoenix,AZ,85004
Alan,Kelvin,C,1102 Ravenwood,Phoenix,AZ,85004
Alan,Meghan,I,1398 Yorba Linda,Phoenix,AZ,85004
Alcorn,Paul,L.,6843 San Simeon Dr.,Phoenix,AZ,85004
Alexander,Alexis,L,6870 D Bel Air Drive,Phoenix,AZ,85004
Alexander,Anna,C,2059 Clay Rd,Phoenix,AZ,85004
Alexander,Caleb,C,1061 Buskrik Avenue,Phoenix,AZ,85004
Alexander,Cassidy,C,2038 EAZino Drive,Phoenix,AZ,85004
Alexander,Dakota,C,2046 Las Palmas,Phoenix,AZ,85004
Alexander,Devin,C,1648 Eastgate Lane,Phoenix,AZ,85004
Alexander,Faith,A,1343 Prospect St,Phoenix,AZ,85004
Alexander,Jocelyn,C,6871 Thornwood Dr.,Phoenix,AZ,85004
Alexander,Melissa,C,101 Candy Rd.,Phoenix,AZ,85004
Alexander,Robert,C,181 Gaining Drive,Phoenix,AZ,85004
Alexander,Zachary,A,1400 Gate Drive,Phoenix,AZ,85004
Allen,Allison,A,1397 Paradise Ct.,Phoenix,AZ,85004
Allen,Carlos,M,1748 Bird Drive,Albuquerque,NM,87105
Allen,Connor,C,1245 Clay Road,Albuquerque,NM,87105
Allen,Eduardo,C,1144 Paradise Ct.,Albuquerque,NM,87105
Allen,Jada,C,1378 String Dr,Albuquerque,NM,87105
Allen,Jordan,L,1803 Olive Hill,Albuquerque,NM,87105
Allen,Marcus,D,1667 Warren Street,Phoenix,AZ,85003
Allen,Morgan,D,1286 CiAZerto Circle,Phoenix,AZ,85003
Allen,Samuel,W,137 LaAZelot Dr,Albuquerque,NM,87105
Allen,Savannah,C,15 Pear Dr.,Albuquerque,NM,87105
Alonso,Dana,J,1192 Parkway Drive,Albuquerque,NM,87105
Alonso,Derrick,W,102 Silverado Drive,Albuquerque,NM,87105
Alonso,Diana,L,683 Larch Ct.,Albuquerque,NM,87105
Alonso,Gloria,S,1619 Mills Dr.,Albuquerque,NM,87105
Alonso,Jon,C,68 Filling Ave.,Albuquerque,NM,87105
Alonso,LawreAZe,S,2014 Delta Road,Albuquerque,NM,87105
Altman,Gary,E.,258 Berry Street,Albuquerque,NM,87105
Alvarez,Darren,C,2575 Bloor Street East,Albuquerque,NM,87105
Alvarez,Krista,C,258 King Street East,Albuquerque,NM,87105
Anand,Derek,C,12345 Sterling Avenue,Albuquerque,NM,87105
Anand,Shawna,P,123 W. Lake Ave.,Albuquerque,NM,87105
Anand,Yolanda,C,1200 First Ave.,Albuquerque,NM,87105
Anderson,Robert,C,123 Union Square South,Albuquerque,NM,87105
Antrim,Ramona,J.,6789 Warren Road,Albuquerque,NM,87105
Arun,Henry,L,257700 Ne 76th Street,Albuquerque,NM,87105
Arun,Meagan,W,15 East Main,Albuquerque,NM,87105
Arun,NaAZy,C,1050 Oak Street,Phoenix,AZ,85006
Bailey,Maria,C,20500 S.W. 2512th Ave,Phoenix,AZ,85006
Bailey,Sara,F,2575 West 2700 South,Las Vegas,NV,89102
Baker,Gabriel,C,123 Camelia Avenue,Las Vegas,NV,89102
Baker,Richard,C,2575 Rocky Mountain Ave.,Las Vegas,NV,89102
Baker,Sean,T,25751 University Drive,Las Vegas,NV,89102
Barlow,Brenda,L.,165 North Main,Las Vegas,NV,89102
Barnes,Aidan,C,1010 Maple,Las Vegas,NV,89102
Barnes,Hailey,C,6828 Benedict Court,Las Vegas,NV,89102
Barnes,Jasmine,J,6868 Firestone,Las Vegas,NV,89102
Barnes,Natalie,C,"102, rue de Berri",Las Vegas,NV,89102
Barnhill,Josh,C,1354 CaNMip Court,Las Vegas,NV,89102
Bashary,Shay,C,1240 Dayton Court,Las Vegas,NV,89102
Beaver,John,A.,2000 Thornwood Dr.,Las Vegas,NV,89102
Beck,Barbara,C,1289 Pine St,Las Vegas,NV,89102
Beck,Derek,C,1354 Helene Court,Las Vegas,NV,89102
Becker,Kelvin,C,154 Kentucky Dr.,Las Vegas,NV,89102
Becker,Lindsay,T,1619 Stillman Court,Las Vegas,NV,89102
Bell,Alex,M,1415 Edwards Ave,Las Vegas,NV,89102
Bell,Cody,A,1725 La Salle Ave.,Las Vegas,NV,89102
Bell,Isaiah,W,1084 Meadow Glen Way,Las Vegas,NV,89102
Bennett,Isabella,K,1624 Carlisle Way,Las Vegas,NV,89102
Bennett,Victoria,D,6885 Amending Drive,Las Vegas,NV,89102
Bernacchi,Robert,M.,1023 Hawkins Street,Las Vegas,NV,89102
Berndt,Matthias,T,1064 William Way,Las Vegas,NV,89102
Billstrom,Mary,B.,6790 Loma Linda,Las Vegas,NV,89102
Bishop,Mary,C,1745 Marina Pkwy.,Las Vegas,NV,89102
BlaAZo,Brandi,L,1201 Olive Hill,Las Vegas,NV,89102
BlaAZo,FraAZis,J,1622 Silver Oaks Place,Las Vegas,NV,89102
BlaAZo,Frank,C,1663 Park Glen Court,Las Vegas,NV,89102
BlaAZo,Max,C,"1402, rue Lauriston",Las Vegas,NV,89102
BlaAZo,Tanya,W,1242 Ridgewood Ct.,Las Vegas,NV,89102
BlaAZo,Teresa,C,1160 Bella Avenue,Las Vegas,NV,89102
Black,Michele,C,1907 Grand Ct.,Las Vegas,NV,89102
Black,Mindy,W,1640 Windmill Way,Las Vegas,NV,89102
Black,Shawn,A,6863 Shakespeare Dr,Las Vegas,NV,89102
Blue,Marcus,L,1016 Park Avenue,Las Vegas,NV,89102
Blue,Maria,M,1032 Buena Vista,Las Vegas,NV,89102
Blue,Mason,C,2003 Pinecrest Dr.,Las Vegas,NV,89102
Blythe,Michael,G,1229 Apollo Way,Las Vegas,NV,89102
Boseman,Randall,C,1358 Palmer Rd,Las Vegas,NV,89102
Bourne,Stephanie,C,1148 Thornwood Drive,Las Vegas,NV,89102
Bradley,Jocelyn,C,1105 N. 48th St,Las Vegas,NV,89102
Bradley,Katherine,C,1120 Curtis Drive,Las Vegas,NV,89102
Bradley,Shelby,C,6880 N Lanky Lane,Las Vegas,NV,89102
Brooks,Alexandria,C,1355 Sequoia Drive,Las Vegas,NV,89102
Brooks,Gabrielle,M,1289 Quiz St.,Las Vegas,NV,89102
Brooks,Garrett,L,1747 Corte Segundo,Las Vegas,NV,89102
Brooks,Jacqueline,W,101 Adobe Dr,Las Vegas,NV,89102
Brooks,Mackenzie,C,1752 Attic Lane,Las Vegas,NV,89102
Brooks,Mariah,C,1111 Bayview Cr,Las Vegas,NV,89102
Brooks,Stephanie,E,683 Larch Ct.,Las Vegas,NV,89102
Brooks,Sydney,M,6797 Almondtree Circle,Las Vegas,NV,89102
Brown,Jessica,L,1207 CoAZerto Circle,Las Vegas,NV,89102
Brown,Morgan,C,1462 Summit View Dr.,Las Vegas,NV,89102
Brown,Noah,D,174 Kim Court,Las Vegas,NV,89102
Brown,Olivia,C,"167, rue de la Comédie",Las Vegas,NV,89102
Brown,Robert,D,1242 Frame Lane,Las Vegas,NV,89102
Brown,Tyler,C,6820 Willow Pass Dr,Las Vegas,NV,89102
Browne,Kevin,F.,2056 Otter Dr.,Las Vegas,NV,89102
Browning,Mary,K.,"201, avenue de la Gare",Las Vegas,NV,89102
Bryant,Aidan,R,1807 Trafalgar Circle,Las Vegas,NV,89102
Bryant,Alexandra,C,1023 Riviera Way,Las Vegas,NV,89102
Bryant,Ana,C,1297 Zulu Court,Las Vegas,NV,89102
Bryant,Antonio,R,1206 Limewood Place,Las Vegas,NV,89102
Bryant,Carson,C,1379 T St.,Las Vegas,NV,89102
Bryant,Ian,C,2049 Benedict Court,Las Vegas,NV,89102
Bryant,Kyle,C,6793 Longview Road,Las Vegas,NV,89102
Bryant,Luke,C,1159 LaCrosse Ave,Las Vegas,NV,89102
Bryant,Ryan,W,14 Delta Road,Las Vegas,NV,89102
Bryant,Seth,M,1413 Bridgeview St,Las Vegas,NV,89102
Burnell,Dana,H.,258 Bluejay Dr.,Las Vegas,NV,89102
Burnett,Linda,E.,2007 Shady Ln.,Las Vegas,NV,89102
Butler,Ashley,A,"689, rue Maillard",Las Vegas,NV,89102
Butler,Benjamin,C,1113 Catherine Way,Las Vegas,NV,89102
Butler,Cassidy,L,1158 Roundtree Place,Las Vegas,NV,89102
Butler,Devin,M,"161, rue de Cambrai",Las Vegas,NV,89102
Butler,Eduardo,G,1331 H St.,Las Vegas,NV,89102
Butler,Fernando,C,2012 Melody Dr,Las Vegas,NV,89102
Butler,Lauren,C,1020 Book Road,Scottsdale,AZ,85256
Butler,Maria,C,1661 Beauty St.,Scottsdale,AZ,85256
Butler,Richard,C,1488 Guadalupe Dr.,Scottsdale,AZ,85256
Cai,Colin,C,1119 Elderwood Dr.,Scottsdale,AZ,85256
Cai,Glenn,C,6885 Amending Drive,Scottsdale,AZ,85256
Cai,Leah,C,1019 ChaAZe Drive,Scottsdale,AZ,85256
Cai,Shannon,C,1192 Parkway Drive,Scottsdale,AZ,85256
Cai,Tiffany,C,1805 Gallagher Circle,Scottsdale,AZ,85256
Campbell,Amanda,C,2575 Garcia,Scottsdale,AZ,85256
Campbell,Eric,C,1889 Carmel Dr,Scottsdale,AZ,85256
Campbell,Gabriella,C,6883 Freda Drive,Scottsdale,AZ,85256
Campbell,Hunter,C,1329 San Jose,Scottsdale,AZ,85256
Campbell,Jesse,C,1613 Santa Maria,Scottsdale,AZ,85256
Campbell,Luis,A,1439 N. Canyon Road,Scottsdale,AZ,85256
Carey,Richard,C,6836 Alum Rock Drive,Scottsdale,AZ,85256
Carlson,Alfredo,C,1242 Ridgewood Ct.,Scottsdale,AZ,85256
Carlson,Erika,C,1144 Paradise Ct.,Scottsdale,AZ,85256
Carlson,Gina,R,6871 Thornwood Dr.,Scottsdale,AZ,85256
Carlson,Gloria,P,2038 EAZino Drive,Scottsdale,AZ,85256
Carlson,Julio,C,1398 Yorba Linda,Scottsdale,AZ,85256
Carlson,Orlando,J,105 Woodruff Ln.,Scottsdale,AZ,85256
Carlson,Ricky,S,1819 Lilac Court,Scottsdale,AZ,85256
Carreras,Donna,F.,1748 Bird Drive,Scottsdale,AZ,85256
Carter,Angel,C,6793 Longview Road,Scottsdale,AZ,85256
Carter,Katelyn,A,1285 Greenbrier Street,Scottsdale,AZ,85256
Carter,Madeline,A,1204 Weber Blvd.,Scottsdale,AZ,85256
Carter,Samuel,C,1631 Via Cordona,Scottsdale,AZ,85256
Carter,Sierra,C,130 North Main St.,Scottsdale,AZ,85256
Cetinok,Baris,C,1025 Yosemite Dr.,Scottsdale,AZ,85256
Chande,Arturo,H,1411 RaAZh Drive,Scottsdale,AZ,85256
Chande,Damien,A,1884 LVramble Road,Scottsdale,AZ,85256
Chande,Franklin,L,1803 Olive Hill,Scottsdale,AZ,85256
Chande,Michele,C,1162 Park Glenn,Scottsdale,AZ,85256
Chande,Nina,D,1197 Santa Barbara,Scottsdale,AZ,85256
Chander,Alejandro,M,1226 Canyon Creek Drive,Scottsdale,AZ,85256
Chander,Brad,K,1800 Honey Court,Scottsdale,AZ,85256
Chander,Corey,A,6850 Monument Blvd.,Scottsdale,AZ,85256
Chander,Johnny,C,1461 Dent Way,Scottsdale,AZ,85256
Chander,Russell,E,1410 N RaAZhford Court,Scottsdale,AZ,85256
Chander,Shawn,S,1197 Santa Barbara,Scottsdale,AZ,85256
Chandra,Ann,C,1363 Mount Circle,Scottsdale,AZ,85256
Chandra,Emmanuel,E,682 Ambush Dr..,Scottsdale,AZ,85256
Chandra,George,H,1617 Crossbow Way,Scottsdale,AZ,85256
Chapman,Kristi,l,1887 Mt. Diablo St,Scottsdale,AZ,85256
Chavez,Colin,C,686 Argonne Drive,Scottsdale,AZ,85256
Chen,Barbara,M,1246 Newport Drive,Scottsdale,AZ,85256
Chen,Darryl,S,6897 Pome Court,Scottsdale,AZ,85256
Chen,David,C,1811 Cashew Lane,Scottsdale,AZ,85256
Chen,Dennis,M,1343 Prospect St,Scottsdale,AZ,85256
Chen,Edwin,C,1288 Vista Del Rio,Scottsdale,AZ,85256
Chen,Omar,J,6834 Violetta,Scottsdale,AZ,85256
Chow,Martha,C,"10bis, rue des Peupliers",Scottsdale,AZ,85256
Christensen,Charles,M.,2578 South Creek Drive,Scottsdale,AZ,85256
Clark,Anna,A,1245 Clay Road,Scottsdale,AZ,85256
Clark,Brianna,R,137 LaAZelot Dr,Scottsdale,AZ,85256
Clark,Christian,H,6834 Violetta,Scottsdale,AZ,85256
Clark,Emma,D,1378 String Dr,Scottsdale,AZ,85256
Clark,Katherine,C,1880 Birchwood,Scottsdale,AZ,85256
Clark,Rachel,K,1569 Eagle Ct,Scottsdale,AZ,85256
Coleman,Cassidy,C,1728 Village Oaks Dr.,Scottsdale,AZ,85256
Coleman,Connor,C,130 Alamo Court,Scottsdale,AZ,85256
Coleman,Julian,L,1059 Delta Fair Blvd.,Scottsdale,AZ,85256
Coleman,Lucas,A,1510 Sharon Dr.,Scottsdale,AZ,85256
Coleman,Luke,A,1487 Santa Fe,Scottsdale,AZ,85256
Coleman,Madison,F,1019 Pennsylvania Blvd,Scottsdale,AZ,85256
Coleman,Mariah,G,1299 Band Court,Scottsdale,AZ,85256
Coleman,Olivia,C,1330 Guadalupe Dr.,Scottsdale,AZ,85256
Collins,Charles,B,1646 Twinview Drive,Scottsdale,AZ,85256
Collins,Logan,H,1293 F Street,Scottsdale,AZ,85256
Collins,Mackenzie,I,2575 Garcia,Scottsdale,AZ,85256
Collins,Marcus,C,144 Santa Monica,Scottsdale,AZ,85256
Collins,Rebecca,M,1080 Crestwood Circle,Scottsdale,AZ,85256
Conroy,Stephanie,A,1531 Birchwood,Scottsdale,AZ,85256
Cook,Alexa,C,1471 Michigan Blvd.,Scottsdale,AZ,85256
Cook,Steven,J,1251 Alan Drive,Scottsdale,AZ,85256
Cook,Timothy,H,2030 Hill Drive,Scottsdale,AZ,85256
Cooper,Abigail,D,1306 B St.,Scottsdale,AZ,85256
Cooper,Cole,C,108 Lakeside Court,Phoenix,AZ,85006
Cooper,LVott,C,1225 Santa Lucia,Phoenix,AZ,85006
Cooper,Mariah,J,6891 Ham Drive,Phoenix,AZ,85006
Cooper,Steven,C,137 Mazatlan,Phoenix,AZ,85006
Cox,Allison,L,134 Peachwillow Street,Phoenix,AZ,85006
Cox,Amanda,C,1641 Overhill Rd,Phoenix,AZ,85006
Cox,Emma,R,101 Adobe Dr,Phoenix,AZ,85006
Cox,Gabriella,C,1510 American Beauty Dr.,Phoenix,AZ,85006
Cox,Jared,E,1663 Park Glen Court,Phoenix,AZ,85016
Cox,Kaitlyn,C,1296 Bishop Court,Phoenix,AZ,85016
Cox,Mariah,C,1604 Crown Court,Phoenix,AZ,85016
Cunningham,Conor,C,1660 Stonyhill Circle,Phoenix,AZ,85016
Danseglio,Mike,C,1301 Stanbridge Ct,Phoenix,AZ,85016
Davis,Jeremy,C,191 Trail Way,Phoenix,AZ,85016
Davis,Madison,C,1646 Texas Way,Phoenix,AZ,85006
Davis,Matthew,S,115 Santa Fe Street,Phoenix,AZ,85006
Davis,Robert,C,1218 Woodside Court,Phoenix,AZ,85006
Davis,Samuel,K,1086 Ash Lane,Phoenix,AZ,85006
Davis,William,C,1264 Eureka Lane,Phoenix,AZ,85006
Dean,Jacob,N.,115 Pine Creek Way,Scottsdale,AZ,85256
Demicell,Shawn,R.,1050 Creed Ave,Scottsdale,AZ,85256
Deng,Colin,B,189 Richview Dr,Scottsdale,AZ,85256
Deng,Jaime,R,1258 Steven Way,Scottsdale,AZ,85256
Deng,Kara,L,149 Valley Blvd.,Scottsdale,AZ,85256
Deng,Shawn,C,1085 Greenbelt Way,Scottsdale,AZ,85256
Deng,TerreAZe,P,6827 Glaze Dr.,Scottsdale,AZ,85256
Diaz,Angelica,C,1287 Youngsdale Drive,Scottsdale,AZ,85256
Diaz,Beth,P,1161 Daffodil Dr.,Scottsdale,AZ,85256
Diaz,Carolyn,C,152 LVenic Ave.,Scottsdale,AZ,85256
Diaz,Gabrielle,C,1005 Matterhorn Ct.,Scottsdale,AZ,85256
Diaz,Hailey,W,6894 Oeffler Ln.,Scottsdale,AZ,85256
Diaz,Ian,D,1283 Teakwood Court,Scottsdale,AZ,85256
Diaz,Kristine,C,6898 Holiday Hills,Scottsdale,AZ,85256
Diaz,Meredith,W,1383 Button Court,Scottsdale,AZ,85256
Diaz,Ross,E,1637 San Carlos Ave,Scottsdale,AZ,85256
Diaz,Sydney,C,1290 Arguello Blvd.,Scottsdale,AZ,85256
Diaz,Taylor,E,133 Westwood Way,Scottsdale,AZ,85256
Dominguez,Anne,C,1463 El Verano,Scottsdale,AZ,85256
Dominguez,Briana,C,1601 Crown Court,Scottsdale,AZ,85256
Dominguez,Erik,L,1733 Thistle Circle,Scottsdale,AZ,85256
Dominguez,Gina,L,1133 Leisure Lane,Scottsdale,AZ,85256
Dominguez,Jésus,C,1306 B St.,Scottsdale,AZ,85256
Dominguez,Josue,R,1174 Ayers Rd,Scottsdale,AZ,85256
Dominguez,Kristine,A,2038 EAZino Drive,Scottsdale,AZ,85256
Dominguez,Roy,C,1519 Birch Bark Road,Scottsdale,AZ,85256
Donovan,John,T.,1732 Parakeet,Scottsdale,AZ,85256
Dudenhoefer,Ed,R,1905 Horseshoe Circle,Scottsdale,AZ,85256
Edwards,Edward,C,1415 Edwards Ave,Scottsdale,AZ,85256
Edwards,Ian,A,1374 Queens Road,Scottsdale,AZ,85256
Edwards,Julia,M,1669 Warwick Dr,Scottsdale,AZ,85256
Edwards,Mason,A,1629 Green View Court,Scottsdale,AZ,85256
Edwards,Richard,P,1258 Yarrow Dr,Scottsdale,AZ,85256
Eminhizer,Terry,J,1472 South Creek Drive,Scottsdale,AZ,85256
Evans,Hailey,C,1160 Via Del Sol,Scottsdale,AZ,85256
Evans,Mary,E,1292 Marsh Elder,Scottsdale,AZ,85256
Fakhouri,Fadi,K,1736 Windsor Drive,Scottsdale,AZ,85256
Fernandez,Ann,M,1065 Almond St.,Scottsdale,AZ,85256
Fernandez,Heidi,L,1082 Selena Court,Scottsdale,AZ,85256
Fernandez,Kristina,A,1256 American Beauty Dr,Scottsdale,AZ,85256
Fernandez,Meagan,C,1261 Viking Drive,Scottsdale,AZ,85256
Fernandez,Michele,M,1301 Northstar Drive,Scottsdale,AZ,85256
Fernandez,Shane,A,1887 Mt. Diablo St,Scottsdale,AZ,85256
Fernandez,Tammy,A,1464 LiAZoln Dr.,Scottsdale,AZ,85256
Ferrier,Edwin,J,1515 Palm Dr,Scottsdale,AZ,85256
Ferrier,Max,C,1627 Ashford Court,Scottsdale,AZ,85256
Flores,Abigail,L,1387 Dias Circle,Scottsdale,AZ,85256
Flores,Alyssa,C,1490 Marina Pkwy.,Scottsdale,AZ,85256
Flores,Brandon,L,1807 Trafalgar Circle,Scottsdale,AZ,85256
Flores,Chloe,F,1641 Overhill Rd,Scottsdale,AZ,85256
Flores,Fernando,M,1172 Flamingo Dr.,Scottsdale,AZ,85256
Flores,Jocelyn,C,2033 Woodbury Place,Scottsdale,AZ,85256
Flores,Jordyn,C,1465 Dover Drive,Scottsdale,AZ,85256
Flores,Kevin,C,1516 Redbird Lane,Scottsdale,AZ,85256
Flores,Nicole,E,1207 Erie Dr,Scottsdale,AZ,85256
Flores,OLVar,L,1135 W St.,Scottsdale,AZ,85256
Flores,Samuel,G,1889 String Drive,Scottsdale,AZ,85256
Focht,Kelly,C,1462 West Cliff Place,Phoenix,AZ,85018
Ford,Jeffrey,L,1106 Pine Creek Way,Phoenix,AZ,85018
Foster,Alexandria,L,1248 Tanager Cir,Phoenix,AZ,85018
Foster,Alexis,C,2015 Bella Avenue,Phoenix,AZ,85018
Foster,Antonio,C,1386 Eastgate,Phoenix,AZ,85018
Foster,Brandon,R,1227 Wesley Court,Phoenix,AZ,85018
Foster,Brittany,R,6899 Jacqueline Way,Phoenix,AZ,85018
Foster,Cameron,C,1813 Cashew Ln,Phoenix,AZ,85018
Foster,Emily,C,1334 Appalachian Drive,Phoenix,AZ,85018
Foster,Emma,C,144 Cast Street,Phoenix,AZ,85018
Foster,Eric,C,1510 Bidwell Street,Phoenix,AZ,85018
Foster,Ethan,C,1640 West Way,Phoenix,AZ,85018
Foster,Maria,E,1029 Birchwood Dr,Phoenix,AZ,85016
Fuentes Espinosa,Alfredo,C,1247 Violet Ct,Phoenix,AZ,85016
Gao,Sandra,C,6857 La Salle Ct,Phoenix,AZ,85016
Garcia,Allen,F,1413 Bridgeview St,Phoenix,AZ,85016
Garcia,Austin,D,1170 Shaw Rd,Phoenix,AZ,85003
Garcia,Brenda,C,1343 Apple Drive,Phoenix,AZ,85003
Garcia,Chloe,M,102 Vista Place,Phoenix,AZ,85003
Garcia,Cory,B,15 Aspen Drive,Scottsdale,AZ,85256
Garcia,Daniel,C,1805 Gallagher Circle,Phoenix,AZ,85018
Garcia,Destiny,B,1164 Glenview Drive,Scottsdale,AZ,85256
Garcia,Eduardo,D,6837 Rosemarie Place,Phoenix,AZ,85003
Garcia,Edward,C,1083 W. Hook Road,Phoenix,AZ,85003
Garcia,George,C,1510 Bidwell Street,Phoenix,AZ,85003
Garcia,Jillian,C,1475 Doyle,Phoenix,AZ,85003
Garcia,Kristi,C,1631 Via Cordona,Phoenix,AZ,85003
Garcia,Megan,F,1729 Panorama Drive,Phoenix,AZ,85003
Garcia,Pamela,S,6855 Leewood Place,Phoenix,AZ,85003
Garcia,Tina,C,1077 Laurel Drive,Phoenix,AZ,85003
Giglio,FraAZes,J.,1295 Fabian Way,Phoenix,AZ,85003
Gilbert,Guy,C,2577 Dover Way,Phoenix,AZ,85003
Gill,Briana,D,1082 Crivello Avenue,Phoenix,AZ,85003
Gill,Gina,F,1336 Terrace Road,Phoenix,AZ,85003
Gill,Kristy,C,1289 Mt. Dias Blv.,Phoenix,AZ,85003
Gill,Latasha,M,1462 Summit View Dr.,Phoenix,AZ,85003
Gill,Linda,C,181 Buena Vista,Phoenix,AZ,85003
Gill,Nelson,G,6843 Mountain View Blvd,Phoenix,AZ,85003
Gill,Roy,C,149 Valley Blvd.,Phoenix,AZ,85003
Goel,Bridget,C,1254 Roux Court,Phoenix,AZ,85003
Goel,Cassie,C,6788 Edward Ave,Phoenix,AZ,85003
Goel,Donna,H,1097 Kulani Lane,Phoenix,AZ,85003
Goel,Kenneth,C,1351 Boxer Blvd.,Phoenix,AZ,85003
Goel,Shawna,L,1176 Oil Road,Phoenix,AZ,85003
Gomez,Erik,T,1206 Olive St,Phoenix,AZ,85003
Gomez,Jaime,C,2058 Richard Ave,Phoenix,AZ,85003
Gomez,Kari,C,165 East Lane Road,Phoenix,AZ,85003
Gomez,Max,C,1135 Glenellen Court,Phoenix,AZ,85003
Gomez,Orlando,C,1054 Vine Circle,Phoenix,AZ,85003
Gomez,Shannon,C,1481 Bent Street,Phoenix,AZ,85003
Gonzales,Amanda,C,1308 Mt. Hood Circle,Phoenix,AZ,85018
Gonzales,Angela,S,1094 Loveridge Circle,Phoenix,AZ,85018
Gonzales,Chloe,C,1162 Relief Valley Ct,Phoenix,AZ,85018
Gonzales,Luis,C,1047 Las Quebradas Lane,Phoenix,AZ,85018
Gonzales,Rachel,A,1088 Ash Lane,Phoenix,AZ,85004
Gonzales,Ryan,M,1902 E. 42nd Street,Phoenix,AZ,85004
Gonzales,Samantha,C,1616 East Lane,Phoenix,AZ,85004
Gonzales,Seth,D,1343 Granola Dr.,Phoenix,AZ,85004
Gonzales,Stephanie,C,1301 Burwood Way,Phoenix,AZ,85004
Gonzalez,Andre,L,1104 O St.,Phoenix,AZ,85004
Gonzalez,CourNMey,C,162 Courthouse Drive,Phoenix,AZ,85004
Gonzalez,Dominique,J,1358 Palmer Rd,Phoenix,AZ,85004
Gonzalez,Evan,C,1646 Twinview Drive,Phoenix,AZ,85004
Gonzalez,Frederick,C,1260 Mt. Washington Way,Phoenix,AZ,85004
Gonzalez,Gabriella,Z,1046 San Carlos Avenue,Phoenix,AZ,85004
Gonzalez,George,L,151 Book Ct,Phoenix,AZ,85004
Gonzalez,Gerald,C,1369 Rambling Lane,Phoenix,AZ,85004
Gonzalez,Jarrod,C,1901 Missing Canyon Court,Phoenix,AZ,85004
Gonzalez,Jay,C,6813 Morning Way,Phoenix,AZ,85018
Gonzalez,Kristopher,C,"67bis, boulevard du Montparnasse",Phoenix,AZ,85018
Gonzalez,Tammy,J,1061 Carzino Ct,Phoenix,AZ,85018
Gonzalez,Xavier,L,2039 Doon Cr,Phoenix,AZ,85018
Gray,Adrian,L,1439 Brock Lane,Phoenix,AZ,85018
Gray,Amanda,E,1291 Honey Court,Phoenix,AZ,85016
Gray,Garrett,N,112 RaceCt,Phoenix,AZ,85016
Gray,Jesse,C,1265 Orchard Ln,Phoenix,AZ,85016
Gray,Mason,C,685 St. Peter Court,Phoenix,AZ,85016
Gray,Sebastian,B,1121 Boynton Avenue,Scottsdale,AZ,85256
Gray,Timothy,K,6794 Robinson Ave.,Scottsdale,AZ,85256
Green,Carlos,C,1528 MapleView Drive,Scottsdale,AZ,85256
Green,Jason,D,6788 Edward Ave,Phoenix,AZ,85003
Green,Luke,R,1306 Longbrood Way,Phoenix,AZ,85003
Green,Mackenzie,C,1354 CaNMip Court,Phoenix,AZ,85018
Green,Mary,S,1019 Book Road,Phoenix,AZ,85018
Green,Nathan,C,1082 Selena Court,Phoenix,AZ,85018
Green,Sydney,C,1538 Mt. Diablo St.,Phoenix,AZ,85018
Griffin,Adam,C,679 Land Ave,Phoenix,AZ,85018
Griffin,Aidan,A,6793 Almond Street,Phoenix,AZ,85004
Griffin,Edward,C,1736 Canyon Rd,Phoenix,AZ,85004
Griffin,Isabella,J,1268 Holiday Hills Drive,Phoenix,AZ,85004
Griffin,Jack,L,1308 B St.,Phoenix,AZ,85004
Griffin,Mariah,C,1201 Ricardo Drive,Phoenix,AZ,85004
Griffin,Mya,L,1192 A St.,Phoenix,AZ,85004
Griffin,Seth,R,1343 Prospect St,Phoenix,AZ,85004
Guo,ClareAZe,C,1907 Pinecrest Dr,Phoenix,AZ,85004
Guo,Marshall,C,1742 Shakespeare Drive,Phoenix,AZ,85018
Guo,Todd,K,1479 Megan Dr,Phoenix,AZ,85018
Gutierrez,Byron,K,1733 CoAZord Place,Phoenix,AZ,85018
Gutierrez,Desiree,C,1567 Midway Ct,Phoenix,AZ,85018
Gutierrez,Jonathon,R,1749 Champion Rd,Phoenix,AZ,85018
Gutierrez,Kellie,K,121 Keith Court,Phoenix,AZ,85018
Gutierrez,LawreAZe,M,6876 Winthrop Street,Phoenix,AZ,85018
Gutierrez,Melinda,K,1622 Silver Oaks Place,Phoenix,AZ,85018
Gutierrez,Pedro,S,1651 Geranium Court,Phoenix,AZ,85018
Gutierrez,Theodore,D,1437 Doon Cr,Phoenix,AZ,85003
Hagens,Erin,M.,1905 July Loop,Phoenix,AZ,85003
Hall,Alexandra,M,6832 Cotton Ct.,Phoenix,AZ,85003
Hall,Dalton,C,1909 N Jackson Way,Phoenix,AZ,85003
Hall,Madeline,C,109 Clay Road,Phoenix,AZ,85003
Hamilton,Bryan,C,6828 Willow Pass Road,Phoenix,AZ,85003
Harris,Alexis,C,1661 Military Way,Phoenix,AZ,85003
Harris,Austin,C,1061 Carzino Ct,Phoenix,AZ,85003
Harris,Charles,E,1147 Delta Way,Phoenix,AZ,85016
Harris,Jonathan,C,1293 Silverwood Drive,Phoenix,AZ,85016
Harris,Olivia,J,205 Park Blvd.,Phoenix,AZ,85016
Harris,Ryan,C,6872 Sandalwood Dr.,Phoenix,AZ,85016
Harris,Wyatt,C,1660 Stonyhill Circle,Phoenix,AZ,85016
Harrison,Ernest,C,1059 Stonewood Ct,Phoenix,AZ,85016
Hayes,Benjamin,C,163 St. John Lane,Phoenix,AZ,85018
Hayes,Gavin,A,1567 Midway Ct,Phoenix,AZ,85004
Hayes,Hannah,J,6787 Terra Calitina,Phoenix,AZ,85004
Hayes,Kayla,C,1140 Panoramic Drive,Phoenix,AZ,85004
Hayes,Logan,J,6867 Thornhill Place,Phoenix,AZ,85004
Hayes,Luke,C,1515 Palm Dr,Phoenix,AZ,85004
Hayes,Melissa,C,1568 Delta Fair Blvd.,Phoenix,AZ,85004
Hayes,Robert,M,1394 Firestone,Phoenix,AZ,85004
He,Autumn,C,1306 Cashew Ln,Phoenix,AZ,85004
He,Darryl,R,1133 CoAZord Place,Phoenix,AZ,85004
He,Jessie,C,1561 Black Point Pl,Phoenix,AZ,85004
He,Mandy,A,1739 Glenhaven Ave,Phoenix,AZ,85004
He,Tamara,C,1525 Waterhigh St,Phoenix,AZ,85004
Henderson,Haley,A,1727 The Trees Drive,Phoenix,AZ,85004
Henderson,Jacqueline,R,1127 Leewood Place,Phoenix,AZ,85004
Henderson,Jordyn,K,1077 Laurel Drive,Phoenix,AZ,85004
Henderson,Jose,C,1300 Zebra Street,Phoenix,AZ,85004
Henderson,Kaitlyn,J,1908 Pansy Dr.,Phoenix,AZ,85004
Henderson,Nathan,C,6797 Smiling Tree Court,Phoenix,AZ,85004
Henningsen,Jay,C,1645 Appleton Court,Phoenix,AZ,85004
Hernandez,Adam,W,1512 Birch Bark Dr,Phoenix,AZ,85004
Hernandez,Andy,C,1726 ChesNMut,Phoenix,AZ,85004
Hernandez,Charles,D,1160 Bella Avenue,Phoenix,AZ,85003
Hernandez,Elijah,C,"1510, rue des Berges",Phoenix,AZ,85003
Hernandez,Hector,E,1050 Greenhills Circle,Phoenix,AZ,85016
Hernandez,Jésus,M,1141 Rolling Hill Way,Phoenix,AZ,85016
Hernandez,Logan,C,1395 Dos Rios Drive,Phoenix,AZ,85016
Hernandez,Miguel,L,1359 Montgomery Avenue,Phoenix,AZ,85016
Hernandez,Ross,C,1739 Glenhaven Ave,Phoenix,AZ,85016
Hernandez,Savannah,F,1613 Cotton Ct,Phoenix,AZ,85016
Hernandez,Theresa,C,1534 Land Ave,Phoenix,AZ,85016
Hernandez,Victor,T,6866 CoAZord Blvd.,Phoenix,AZ,85016
Hernandez,Walter,C,1032 Cowell Road,Phoenix,AZ,85016
Hernandez,Wyatt,S,1567 W Lake Drive,Phoenix,AZ,85016
Hill,Aaron,C,1526 Green Road,Phoenix,AZ,85016
Hill,Kyle,C,6820 Montego,Phoenix,AZ,85016
Hill,Logan,A,1104 Colton Ln,Phoenix,AZ,85004
Hill,Mason,C,1019 Mt. Davidson Court,Phoenix,AZ,85004
Hill,Noah,C,1531 Birchwood,Phoenix,AZ,85004
Hill,Thomas,M,1745 Chickpea Ct,Phoenix,AZ,85004
Homer,Kevin,M,1133 Fillet Ave,Phoenix,AZ,85004
Howard,Adrian,B,112 Kathleen Drive,Scottsdale,AZ,85256
Howard,Alexa,C,6820 Willow Pass Dr,Scottsdale,AZ,85256
Howard,Alexandra,C,6860 Megan Dr,Scottsdale,AZ,85256
Howard,Garrett,C,1098 Lawton Street,Scottsdale,AZ,85256
Howard,Mariah,C,1732 Pine Creek Way,Scottsdale,AZ,85256
Howard,Melanie,A,1639 Atchinson Stage Ct.,Phoenix,AZ,85004
Howard,Sara,W,1077 Willow Court,Phoenix,AZ,85004
Hu,Alvin,E,1483 Browse Street,Scottsdale,AZ,85250
Hu,Glenn,R,201 Bush Avenue,Scottsdale,AZ,85250
Hu,Krystal,D,1218 Woodside Court,Scottsdale,AZ,85250
Hu,Tiffany,A,1754 Polk Street,Scottsdale,AZ,85250
Huang,Alan,A,1113 Ready Road,Scottsdale,AZ,85250
Huang,Lisa,L,2047 Westbury Dr,Scottsdale,AZ,85250
Huang,Louis,L,1403 McMillan Ave.,Scottsdale,AZ,85250
Huang,Stacey,C,1366 Hunt Dr,Scottsdale,AZ,85250
Hughes,Aaron,J,1192 ToLVa Way,Scottsdale,AZ,85250
Hughes,Austin,P,6819 Krueger Drive,Scottsdale,AZ,85250
Hughes,Blake,D,1305 Rain Drop Circle,Phoenix,AZ,85003
Hughes,Brianna,A,1538 Golden Meadow,Phoenix,AZ,85004
Hughes,Brittany,C,2036 Bellwood Court,Phoenix,AZ,85004
Hughes,Gabrielle,C,1036 Mason Dr,Phoenix,AZ,85004
Hughes,Julia,C,1614 Green St,Phoenix,AZ,85004
Hughes,Maria,C,1909 N Jackson Way,Phoenix,AZ,85004
Hurtado,Begoña,M,1752 Amaryllis Drive,Phoenix,AZ,85004
Ison,Denean,J.,6837 Pirate Lane,Phoenix,AZ,85004
Jackson,Alexander,R,6838 El RaAZho Drive,Phoenix,AZ,85004
Jackson,Cameron,H,1136 Lane Way,Phoenix,AZ,85004
Jackson,Grace,C,153 Kenston Dr,Phoenix,AZ,85018
Jackson,Jasmine,C,1724 VaAZover Way,Phoenix,AZ,85018
Jackson,Jeremiah,A,1221 Foxhill Dr,Phoenix,AZ,85018
Jackson,Ryan,G,1105 N. 48th St,Phoenix,AZ,85018
Jackson,Tyler,L,6832 Fruitwood Dr,Phoenix,AZ,85018
Jai,Bethany,B,1048 Burwood Way,Phoenix,AZ,85018
Jai,Brad,C,1237 DaAZe Court,Phoenix,AZ,85018
Jai,Gilbert,J,1247 Cardiff Dr.,Phoenix,AZ,85018
Jai,Johnny,L,1739 Sun View Terr,Phoenix,AZ,85018
Jai,Karl,A,6790 Edward Avenue,Phoenix,AZ,85004
Jai,Kelsey,J,2010 Coach Place,Phoenix,AZ,85004
Jai,Tasha,A,2013 Filling Ave.,Phoenix,AZ,85004
James,Alyssa,J,1201 Ricardo Drive,Phoenix,AZ,85004
James,Evan,V,1462 West Cliff Place,Phoenix,AZ,85004
James,Makayla,E,165 Showtime Court,Scottsdale,AZ,85250
James,Megan,S,6872 Jimno Ave.,Scottsdale,AZ,85250
James,Patrick,C,683 Larch Ct.,Scottsdale,AZ,85250
James,Richard,D,1800 Honey Court,Phoenix,AZ,85003
James,Victoria,C,1130 Fillet Ave.,Phoenix,AZ,85003
Jenkins,Eduardo,O,6850 Monument Blvd.,Phoenix,AZ,85003
Jenkins,Faith,C,2578 South Creek Drive,Phoenix,AZ,85003
Jenkins,Jackson,C,1250 Sierra Ridge,Phoenix,AZ,85003
Jenkins,Kyle,L,182 Perry Way,Phoenix,AZ,85003
Jenkins,Ryan,C,1723 StandingView Dr. Dr,Scottsdale,AZ,85250
Jimenez,Diana,M,1162 Park Glenn,Scottsdale,AZ,85250
Jimenez,Kendra,C,1671 F St.,Scottsdale,AZ,85250
Jimenez,Nelson,C,1030 Ambush Dr.,Scottsdale,AZ,85250
Jimenez,Ricky,J,1727 The Trees Drive,Scottsdale,AZ,85250
Johnsen,Marvin,T,1635 Carmel Dr,Scottsdale,AZ,85250
Johnson,Alexander,M,134 Peachwillow Street,Scottsdale,AZ,85250
Johnson,Alexis,J,174 MacArthur Avenue,Scottsdale,AZ,85250
Johnson,Andrew,F,1161 Daffodil Dr.,Scottsdale,AZ,85250
Johnson,Chloe,L,1629 Queens Road,Scottsdale,AZ,85250
Johnson,Emma,M,1415 Nottingham Place,Scottsdale,AZ,85250
Johnson,Jennifer,F,1883 Green View Court,Scottsdale,AZ,85250
Johnson,Miguel,C,1807 West Cliff Pl.,Scottsdale,AZ,85250
Jones,Ethan,C,2579 The Trees Dr.,Scottsdale,AZ,85250
Jones,Jeremiah,C,1648 Eastgate Lane,Scottsdale,AZ,85250
Jones,Madison,C,1516 Redbird Lane,Scottsdale,AZ,85250
Jones,Michael,A,1485 La Vista Avenue,Phoenix,AZ,85004
Jordan,Joel,M,1366 Hunt Dr,Phoenix,AZ,85004
Jordan,Stefanie,C,1476 ChesNMut Ave.,Phoenix,AZ,85004
Kaffer,LVott,B.,6897 Deerfield Dr.,Phoenix,AZ,85006
Kapoor,Adriana,C,1256 Orangewood Ave.,Phoenix,AZ,85006
Kapoor,Candace,C,1064 Almond Drive,Phoenix,AZ,85006
Kapoor,Denise,M,1510 American Beauty Dr.,Phoenix,AZ,85006
Kapoor,Harold,S,6878 Dublin,Phoenix,AZ,85006
Kapoor,Regina,C,1284 Poppy Pl.,Phoenix,AZ,85006
Kawai,Masato,C,2014 Delta Road,Phoenix,AZ,85006
Keiser,Debra,C,1172 Lunar Lane,Phoenix,AZ,85006
Kelly,Alexandria,I,1117 Ashford Court,Phoenix,AZ,85006
Kelly,Eduardo,C,1028 Green View Court,Scottsdale,AZ,85250
Kelly,Jacqueline,C,2015 Bella Avenue,Scottsdale,AZ,85250
Kelly,Sean,C,138 LaAZelot Dr.,Scottsdale,AZ,85250
Keyser,Elizabeth,C,1627 Ashford Court,Scottsdale,AZ,85250
Khan,Imtiaz,C,1159 Filling Ave.,Scottsdale,AZ,85250
Khan,Imtiaz,C,1519 Sheffield Place,Scottsdale,AZ,85250
Kim,Jim,C,6886 Melody Drive,Scottsdale,AZ,85250
King,Carlos,M,6869 Shakespeare Drive,Scottsdale,AZ,85250
King,Charles,L,1413 Winter Drive,Scottsdale,AZ,85250
King,Isabella,E,1724 The Trees Drive,Scottsdale,AZ,85250
King,Jenna,R,1124 Leeds Ct. West,Scottsdale,AZ,85250
King,Jeremiah,C,1108 Cactus Court,Scottsdale,AZ,85250
King,Katelyn,C,2578 Welle Road,Scottsdale,AZ,85250
King,Katherine,A,1509 Orangewood Ave.,Phoenix,AZ,85025
King,Kevin,W,1164 Bell Drive,Phoenix,AZ,85025
King,Madeline,B,1491 Marina Vill Pkwy,Phoenix,AZ,85025
King,Morgan,C,1378 California St.,Phoenix,AZ,85025
King,Noah,C,6790 Edward Avenue,Phoenix,AZ,85025
King,Russell,M,1510 Sharon Dr.,Phoenix,AZ,85025
King,Sydney,L,1804 B Southampton Rd.,Phoenix,AZ,85025
King,Thomas,M,2049 Jason Court,Phoenix,AZ,85025
Kirilov,Anton,C,1163 Bella Vista,Phoenix,AZ,85025
Kovar,Kristina,R,2058 Richard Ave,Phoenix,AZ,85025
Kumar,Cameron,S,1728 Village Oaks Dr.,Phoenix,AZ,85025
Kumar,Drew,W,6888 Niagara Court,Phoenix,AZ,85025
Kumar,Kara,C,1121 Serrano Way,Phoenix,AZ,85025
Kumar,Leonard,C,1391 Band Court,Phoenix,AZ,85025
Kumar,Misty,H,6866 Big Canyon Rd.,Phoenix,AZ,85025
Kumar,Nina,L,1218 Trasher Road,Phoenix,AZ,85025
Kumar,Shawna,L,1646 Seal Way,Phoenix,AZ,85025
Kumar,Tamara,A,1178 Flora Ave.,Phoenix,AZ,85025
Lal,Alisha,C,1514 West M Street,Scottsdale,AZ,85250
Lal,Andres,L,1288 Mt. Dias Blvd.,Scottsdale,AZ,85250
Lal,Benjamin,A,1074 Lori Drive,Scottsdale,AZ,85250
Lal,Damien,C,6842 Fernwood Drive,Scottsdale,AZ,85250
Lal,Lacey,L,1387 Dias Circle,Scottsdale,AZ,85250
Lal,Lindsey,H,1345 Blocking Circle,Scottsdale,AZ,85250
Laszlo,Rebecca,A,1032 Coats Road,Scottsdale,AZ,85250
Lee,Charles,C,1130 Fillet Ave.,Scottsdale,AZ,85250
Lee,David,J,6857 Medina Drive,Scottsdale,AZ,85250
Lee,Jennifer,R,1229 Harness Circle,Scottsdale,AZ,85250
Lee,William,C,1290 Arguello Blvd.,Scottsdale,AZ,85250
Leonetti,A.,F,1019 Candy Rd.,Scottsdale,AZ,85250
Levy,Steven,B.,6896 Camino Norte,Phoenix,AZ,85006
Lewis,Brandon,A,1133 Beauer Lane,Phoenix,AZ,85025
Lewis,Jeremiah,C,1388 Rolando Avenue,Phoenix,AZ,85025
Lewis,Marcus,L,6831 Boxwood Drive,Phoenix,AZ,85025
Li,Alejandro,A,1127 Oak Street,Phoenix,AZ,85025
Li,Benjamin,H,6854 Muir Road,Phoenix,AZ,85025
Li,Brent,P,1514 West M Street,Phoenix,AZ,85025
Li,Caleb,C,6857 La Salle Ct,Phoenix,AZ,85025
Li,Gilbert,C,1906 Adobe Dr.,Phoenix,AZ,85025
Li,Leah,C,6848 Calico Way,Phoenix,AZ,85025
Li,Tiffany,J,6888 Relief Valley Ct.,Phoenix,AZ,85025
Liang,BritNMey,R,1045 Lolita Drive,Phoenix,AZ,85025
Liang,Jamie,E,1513 Deercreek Ln.,Scottsdale,AZ,85250
Liang,Jenny,S,1299 Carpetta Circle,Scottsdale,AZ,85250
Liang,Kelli,C,121 Keith Court,Scottsdale,AZ,85250
Liang,Marshall,J,1295 Fabian Way,Scottsdale,AZ,85250
Liang,Martha,C,156 East Lake Court,Scottsdale,AZ,85250
Lin,Mandy,C,1334 Appalachian Drive,Scottsdale,AZ,85250
Lin,Omar,C,1296 Bishop Court,Scottsdale,AZ,85250
Lin,Stacey,B,2015 Sunset Circle,Phoenix,AZ,85006
Lin,Suzanne,C,133 Lorie Ln.,Phoenix,AZ,85006
Lin,Tamara,M,1120 Curtis Drive,Phoenix,AZ,85006
Liu,Glenn,C,1487 Santa Fe,Phoenix,AZ,85006
Liu,Jamie,J,2574 Red Leaf,Phoenix,AZ,85006
Liu,Karen,F,1465 Dover Drive,Phoenix,AZ,85006
Liu,Suzanne,C,174 Carlotta,Phoenix,AZ,85006
Long,Abigail,F,1905 Clyde Street,Phoenix,AZ,85006
Long,Angela,C,1817 Adobe Drive,Phoenix,AZ,85006
Long,Destiny,C,1003 Matterhorn Ct,Phoenix,AZ,85006
Long,Eric,S,1037 Hayes Court,Phoenix,AZ,85006
Long,Gabrielle,C,1077 Willow Court,Phoenix,AZ,85006
Long,Jordyn,C,1291 Arguello Blvd.,Phoenix,AZ,85006
Long,Noah,K,1069 Ahwanee Lane,Phoenix,AZ,85006
Looney,Sharon,J.,1466 Aspen Drive,Phoenix,AZ,85006
Lopez,Brandy,S,151 Buchanan Ct,Phoenix,AZ,85006
Lopez,Bruce,C,1885 Riverside Drive,Phoenix,AZ,85006
Lopez,Bryant,C,1028 Indigo Ct.,Phoenix,AZ,85006
Lopez,Darren,C,1006 Deercreek Ln,Phoenix,AZ,85006
Lopez,Denise,K,1133 Fillet Ave,Phoenix,AZ,85006
Lopez,Edward,L,1645 Alicante Court,Phoenix,AZ,85006
Lopez,Evelyn,E,6798 Roosevelt Avenue,Scottsdale,AZ,85250
Lopez,Kristopher,L,1087 Knollview Court,Scottsdale,AZ,85250
Lopez,Monica,M,1162 Thunderbird Drive,Scottsdale,AZ,85250
Lopez,Rebekah,C,1121 Ferry Street,Scottsdale,AZ,85250
Lopez,Shane,C,1416 Melody Drive,Scottsdale,AZ,85250
Lopez,Sydney,C,6879 Winthrop St.,Scottsdale,AZ,85250
Lopez,Wyatt,C,1884 Scottsdale Road,Scottsdale,AZ,85250
Low,SpeAZer,C,1005 Fremont Street,Scottsdale,AZ,85250
Lu,Arturo,E,2037 Bellwood Dr,Scottsdale,AZ,85250
Lu,Edwin,C,1086 Rose Dr.,Scottsdale,AZ,85250
Lu,Jenny,J,1219 Hilltop Road,Scottsdale,AZ,85250
Lu,Karen,K,1259 Ygnacio Valley Road,Scottsdale,AZ,85250
Lu,Micah,C,6868 West,Scottsdale,AZ,85250
Lu,Suzanne,K,156 East Lake Court,Scottsdale,AZ,85250
Lu,Tamara,E,6832 Le Jean Way,Scottsdale,AZ,85250
Luo,Corey,C,1397 Paradiso Ct.,Scottsdale,AZ,85250
Luo,Gregory,C,1515 Tuolumne St.,Scottsdale,AZ,85250
Luo,Kara,C,1536 Camino Verde Ct.,Scottsdale,AZ,85250
Luo,Yolanda,C,1293 F Street,Scottsdale,AZ,85250
LVhmidt,Allen,C,1226 Linden Lane,Scottsdale,AZ,85256
LVhmidt,Marc,C,1088 Ash Lane,Scottsdale,AZ,85256
LVhmidt,Michele,M,1267 Baltic Sea Ct.,Scottsdale,AZ,85256
LVhmidt,Shane,C,1492 Bermad Dr.,Scottsdale,AZ,85256
LVhulte,LVot,C,1480 Canyon Creek Drive,Scottsdale,AZ,85256
LVott,Jonathan,C,1134 CoAZord Pl.,Scottsdale,AZ,85256
LVott,Miguel,C,1178 Sandy Blvd.,Scottsdale,AZ,85256
LVott,Sean,F,1439 N. Michell Canyon Rd.,Scottsdale,AZ,85256
Ma,Amy,E,6888 Niagara Court,Scottsdale,AZ,85250
Ma,Jeffery,C,6866 CoAZord Blvd.,Scottsdale,AZ,85250
Ma,Nuan,C,1158 Roundtree Place,Scottsdale,AZ,85250
Ma,Ramon,D,1480 Oliveria Road,Tempe,AZ,85233
Ma,Stacey,C,1354 Helene Court,Tempe,AZ,85233
Madan,Cynthia,C,1905 Julpum Loop,Tempe,AZ,85233
Madan,Molly,A,1723 Richard Pl.,Tempe,AZ,85233
Madan,Regina,C,1560 Harbor View Drive,Tempe,AZ,85233
Male,Pete,C,1053 Rain Drop Circle,Tempe,AZ,85233
Malhotra,Allen,A,6855 Leewood Place,Tempe,AZ,85233
Malhotra,Candace,J,113 Gordon Ct.,Tempe,AZ,85233
Malhotra,Deanna,M,1612 Geary Ct.,Tempe,AZ,85233
Malhotra,Evelyn,C,204 Heathrow Court,Tempe,AZ,85233
Malhotra,Jarrod,E,1054 Vloching Circle,Tempe,AZ,85233
Malhotra,Kristina,C,1658 Stonyhill Circle,Tempe,AZ,85233
Malhotra,Monica,D,1058 Kirker Pass Road,Tempe,AZ,85233
Marcovecchio,Kathy,R.,1652 Buskirk Ave,Tempe,AZ,85233
Martin,Adrienne,C,2055 Fountain Road,Tempe,AZ,85233
Martin,Andy,F,6819 Meadow Lane,Tempe,AZ,85233
Martin,Benjamin,C,1044 San Carlos,Tempe,AZ,85233
Martin,Benjamin,R,157 Birch Bark Road,Tempe,AZ,85233
Martin,Billy,B,1906 Seaview Avenue,Tempe,AZ,85233
Martin,Danny,C,1093 Gatter Court,Tempe,AZ,85233
Martin,Diana,C,6820 Montego,Tempe,AZ,85233
Martin,Hector,C,1307 Horseshoe Circle,Tempe,AZ,85233
Martin,Jaime,C,2049 Benedict Court,Tempe,AZ,85233
Martin,Kellie,R,1305 Rain Drop Circle,Tempe,AZ,85233
Martin,Leslie,C,1190 Hill Top Rd.,Tempe,AZ,85233
Martin,Noah,A,1040 Northridge Road,Phoenix,AZ,85025
Martin,Ricky,C,1528 Marlene Drive,Phoenix,AZ,85025
Martinez,Geoffrey,L,2033 Woodbury Place,Phoenix,AZ,85025
Martinez,Hannah,M,1015 Lynwood Drive,Phoenix,AZ,85025
Martinez,Kristi,L,160 Kentucky Drive,Phoenix,AZ,85025
Martinez,Linda,C,1228 FraAZine Court,Phoenix,AZ,85025
Martinez,Lucas,S,1228 FraAZine Court,Phoenix,AZ,85025
Martinez,Marco,M,1644 Alicante Court,Phoenix,AZ,85025
Martinez,Megan,C,6890 Highland Road,Phoenix,AZ,85025
Martinez,Miguel,C,1530 Dallis Drive,Phoenix,AZ,85025
Martinez,Roy,J,133 Lorie Ln.,Phoenix,AZ,85025
Martinez,Tina,J,1028 Green View Court,Phoenix,AZ,85025
Masters,Steve,C,1141 Redwood Road,Phoenix,AZ,85025
McDonald,Claudia,C,2036 Bellwood Court,Phoenix,AZ,85025
McDonald,Elijah,C,1395 Bonanza,Phoenix,AZ,85025
Mehlert,John,C,1804 B Southampton Rd.,Phoenix,AZ,85025
Mehta,Ebony,J,1135 W St.,Phoenix,AZ,85025
Mehta,Gerald,C,1740 Calpine Place,Phoenix,AZ,85025
Mehta,Henry,R,112 Kathleen Drive,Phoenix,AZ,85025
Mehta,Marco,C,6866 Winterberry Ct.,Phoenix,AZ,85025
Mehta,Troy,C,1099 Catalpa Court,Phoenix,AZ,85025
Meyer,Eric,B.,1245 West Hookston Road,Phoenix,AZ,85006
Miller,Jacob,C,1490 Marina Hill Pkwy.,Phoenix,AZ,85006
Miller,José,S,"18061, rue Lamarck",Phoenix,AZ,85006
Miller,Joseph,A,1663 Almond Drive,Phoenix,AZ,85006
Miller,Megan,C,1176 Oily Road,Phoenix,AZ,85006
Miller,Wyatt,M,1242 Frayne Lane,Phoenix,AZ,85006
Mitchell,Devin,C,1246 Amaryl Drive,Phoenix,AZ,85006
Mitchell,Gabrielle,C,1177 Oily Road,Phoenix,AZ,85006
Mitchell,Jennifer,B,1564 Weston Court,Phoenix,AZ,85006
Mitchell,Savannah,C,6880 N Lucile Lane,Phoenix,AZ,85006
Monitor,Alan,L.,6898 Holiday Hills,Phoenix,AZ,85006
Moore,Andrew,A,1409 Coachman Pl.,Phoenix,AZ,85025
Moore,Jose,M,"1881, boulevard Beau Marchais",Phoenix,AZ,85025
Moore,Julia,C,1368 Palms Drive,Phoenix,AZ,85025
Moore,Victoria,C,6874 Magnolia Ave.,Phoenix,AZ,85025
Moreno,Anne,A,1817 Hilltop Rd,Phoenix,AZ,85025
Moreno,Carolyn,C,1516 Court Lane,Phoenix,AZ,85025
Moreno,Gary,E,1201 Paso Del Rio Way,Phoenix,AZ,85025
Moreno,Joe,C,1803 Potomac Dr.,Phoenix,AZ,85025
Moreno,Kendra,C,1048 Las Quebradas Lane,Phoenix,AZ,85025
Moreno,Kristi,C,109 Mesa Road,Phoenix,AZ,85025
Moreno,Robin,C,162 Maureen Lane,Phoenix,AZ,85025
Moreno,Walter,L,1105 O St.,Phoenix,AZ,85025
Morgan,Angel,G,6832 Cunha Ct.,Phoenix,AZ,85025
Morgan,Bryce,J,2039 Dallis Dr.,Phoenix,AZ,85025
Morgan,Caitlin,C,117 Esperanza Dr,Scottsdale,AZ,85250
Morgan,Carlos,C,157 Tara St.,Scottsdale,AZ,85250
Morgan,Charles,G,1144 N. Jackson Way,Scottsdale,AZ,85250
Morgan,Chase,D,1439 Springvale Court,Scottsdale,AZ,85250
Morgan,Eduardo,M,1612 Geary Ct.,Scottsdale,AZ,85250
Morgan,Isabella,L,1398 Dimaggio Way,Scottsdale,AZ,85250
Morgan,Taylor,M,1907 Galveston Ct.,Scottsdale,AZ,85250
Morris,Alyssa,C,6820 Gladstone Dr.,Scottsdale,AZ,85250
Morris,Haley,A,1006 Deercreek Ln,Scottsdale,AZ,85256
Morris,Julia,C,1328 Huntleigh Dr.,Scottsdale,AZ,85256
Morris,Morgan,P,1011 Yolanda Circle,Scottsdale,AZ,85256
Morris,Savannah,C,1398 Morengo Court,Scottsdale,AZ,85256
Morris,Taylor,V,1413 Withers Drive,Scottsdale,AZ,85256
Moya,Marie,E.,1619 Mills Dr.,Scottsdale,AZ,85256
Moyer,Felicia,C,1568 Skyline Dr.,Scottsdale,AZ,85256
Mu,Zheng,C,1652 Willcrest Circle,Scottsdale,AZ,85256
Munoz,Alfredo,C,6836 Somerset Pl.,Scottsdale,AZ,85256
Munoz,Clinton,F,1177 Oily Road,Scottsdale,AZ,85256
Munoz,Marvin,C,1040 Greenbush Drive,Scottsdale,AZ,85256
Munoz,Tabitha,A,1005 Matterhorn Ct.,Scottsdale,AZ,85256
Murphy,Brian,C,1019 Carletto Drive,Scottsdale,AZ,85256
Murphy,Catherine,L,2015 Sunset Circle,Scottsdale,AZ,85256
Murphy,Gabriella,D,104 Kaski Ln.,Tempe,AZ,85233
Murphy,Haley,C,1639 Atchinson Stage Ct.,Tempe,AZ,85233
Murphy,Isabella,C,1172 Flamingo Dr.,Tempe,AZ,85233
Murphy,Jeremy,C,6899 Mendocino Drive,Tempe,AZ,85233
Murphy,Mackenzie,J,156 Ulfinian Way,Tempe,AZ,85233
Murphy,Maria,C,1604 Crown Court,Tempe,AZ,85233
Murphy,Rachel,A,1173 Dale Pl.,Tempe,AZ,85233
Murphy,Sydney,T,1737 Thomas Ave.,Tempe,AZ,85233
Nara,Alvin,A,1309 C St.,Scottsdale,AZ,85256
Nara,Brad,G,1562 Petarct,Scottsdale,AZ,85256
Nara,Dustin,M,6841 Curletto Dr.,Scottsdale,AZ,85256
Nara,Edwin,R,1268 Joseph Ave,Scottsdale,AZ,85256
Nara,Karl,C,1251 Alan Drive,Scottsdale,AZ,85256
Nara,Kathryn,E,1525 Dumbarton St,Phoenix,AZ,85025
Nara,Katrina,Z,1095 Collins Drive,Phoenix,AZ,85025
Nara,Kelsey,A,1080 Crestwood Circle,Phoenix,AZ,85025
Nara,Kenneth,K,205 Choctaw Court,Phoenix,AZ,85025
Nara,Latoya,J,1757 Hames Court,Phoenix,AZ,85025
Nara,Marshall,H,1527 St. John Lane,Phoenix,AZ,85025
Nath,Casey,C,1226 Canyon Creek Drive,Phoenix,AZ,85025
Nath,Christine,M,163 St. John Lane,Phoenix,AZ,85025
Nath,Gregory,C,2050 B Avenue I,Phoenix,AZ,85025
Nath,Katrina,R,1480 Shoenic,Phoenix,AZ,85025
Nath,Kelsey,K,1064 Armstrong Rd.,Phoenix,AZ,85025
Nath,Michele,L,6820 Krueger Drive,Phoenix,AZ,85025
Nath,Sheena,C,1058 Park Blvd.,Phoenix,AZ,85025
Navarro,Eddie,C,152 Mill Road,Scottsdale,AZ,85250
Navarro,Hector,C,1046 Cloverleaf Circle,Scottsdale,AZ,85250
Navarro,Jacquelyn,C,1374 Boatwright Dr.,Scottsdale,AZ,85250
Navarro,Jésus,L,1606 Alderwood Lane,Scottsdale,AZ,85250
Navarro,Pedro,C,"1080, quai de Grenelle",Scottsdale,AZ,85250
Nelson,Devin,C,1011 Green St.,Scottsdale,AZ,85250
Nelson,Jonathan,E,1005 Valley Oak Plaza,Phoenix,AZ,85025
Nelson,Richard,C,1646 Seal Way,Phoenix,AZ,85025
O'Donnell,Claire,C,1610 Ashwood Dr.,Phoenix,AZ,85025
Okada,Yoichiro,C,1142 Firestone Dr.,Phoenix,AZ,85025
Oliver,Maria,C,6869 Meier Road,Scottsdale,AZ,85250
Orona,Gloria,B.,1305 Willbrook Court,Phoenix,AZ,85006
Ortega,Armando,K,1287 Youngsdale Drive,Phoenix,AZ,85006
Ortega,Dwayne,C,1026 Mt. Wilson Pl.,Scottsdale,AZ,85250
Ortega,Erik,A,2013 Fitzuren,Scottsdale,AZ,85256
Ortega,Kendra,C,1065 Coachman Pl.,Scottsdale,AZ,85256
Ortiz,David,J,1238 Joan Ave.,Scottsdale,AZ,85256
Pak,Jae,B,1753 Camby Rd.,Phoenix,AZ,85006
Pal,Alison,C,1065 Coachman Pl.,Phoenix,AZ,85006
Pal,Bradley,M,1906 Twinview Place,Phoenix,AZ,85006
Pal,Bridget,C,1492 Bermad Dr.,Phoenix,AZ,85006
Pal,Jenny,C,1754 Polk Street,Phoenix,AZ,85006
Pal,Jodi,C,1509 American Beauty Dr.,Flagstaff,AZ,86011
Pal,Kelsey,C,"1208, rue Maillard",Flagstaff,AZ,86011
Pal,Lacey,K,1286 CiAZerto Circle,Flagstaff,AZ,86011
Pal,Shawna,W,1730 D Reliez Valley Ct.,Flagstaff,AZ,86011
Pal,Sheena,D,1568 Skyline Dr.,Tempe,AZ,85233
Parker,Alex,C,1141 Panoramic Dr.,Tempe,AZ,85233
Parker,Andrea,L,1141 Panoramic Dr.,Tempe,AZ,85233
Parker,Angel,C,6868 Thornhill Place,Tempe,AZ,85233
Parker,James,C,1024 Walnut Blvd.,Tempe,AZ,85233
Parker,Richard,C,1134 CoAZord Pl.,Tempe,AZ,85233
Parker,Thomas,C,1562 Black Walnut,Tempe,AZ,85233
Patel,Adriana,L,1640 Walter Way,Tempe,AZ,85233
Patel,Carmen,M,1908 Stanford Street,Tempe,AZ,85233
Patel,Evelyn,W,679 Lanton Ave,Tempe,AZ,85233
Patel,Geoffrey,M,1283 Cowell Rd.,Tempe,AZ,85233
Patel,Marco,L,1191 Rhoda Way,Tempe,AZ,85233
Patel,Virginia,R,1093 Via Romero,Tempe,AZ,85233
Patterson,Abigail,H,6819 Terry Lynn Lane,Tempe,AZ,85233
Patterson,Caleb,C,1061 Delta Fair Blvd.,Tempe,AZ,85233
Patterson,Elijah,A,1256 American Beauty Dr,Scottsdale,AZ,85256
Patterson,James,P,1496 ChilpaAZingo,Scottsdale,AZ,85256
Patterson,Jonathan,C,1652 Willcrest Circle,Scottsdale,AZ,85256
Patterson,Julia,V,6836 Somerset Pl.,Scottsdale,AZ,85256
Patterson,Kayla,B,1069 Ahwanee Lane,Phoenix,AZ,85006
Patterson,Luke,C,6854 Muir Road,Phoenix,AZ,85006
Patterson,Margaret,J,1750 Morengo Ct.,Phoenix,AZ,85006
Patterson,Melissa,E,1114 Laurel,Phoenix,AZ,85025
Patterson,Miguel,C,1351 Boxer Blvd.,Phoenix,AZ,85025
Patterson,Olivia,G,6841 Monti Dr.,Phoenix,AZ,85025
Penor,Lori,K,1328 Huntleigh Dr.,Phoenix,AZ,85025
Perez,Devin,C,1294 Golden Rain Road,Phoenix,AZ,85025
Perez,Harold,C,6799 El Camino Dr.,Flagstaff,AZ,86011
Perez,Jenna,C,2059 Mesa Rd,Flagstaff,AZ,86011
Perez,Ronald,C,1649 Temple Court,Flagstaff,AZ,86011
Perez,Roy,C,1301 Stanbridge Ct,Flagstaff,AZ,86011
Perko,Tina,A.,130 North Main St.,Scottsdale,AZ,85256
Perry,Alexis,S,1463 El Verano,Scottsdale,AZ,85256
Perry,Chloe,C,"126, rue Maillard",Scottsdale,AZ,85256
Perry,Connor,C,174 Cedar Point Loop,Scottsdale,AZ,85256
Perry,Ethan,C,1809 Candellero Dr.,Scottsdale,AZ,85256
Perry,Jocelyn,O,1191 Boxwood Dr.,Scottsdale,AZ,85256
Perry,Samuel,C,1654 Bonari Court,Scottsdale,AZ,85256
Perry,SpeAZer,C,1085 Ash Lane,Scottsdale,AZ,85256
Perry,Stephanie,C,1064 William Way,Scottsdale,AZ,85256
Perry,Taylor,J,1757 Hames Court,Scottsdale,AZ,85256
Perry,Tristan,G,1524 Reva Dr.,Scottsdale,AZ,85256
Peterson,Angel,C,1803 Potomac Dr.,Scottsdale,AZ,85256
Peterson,Brian,C,1162 Relief Valley Ct,Scottsdale,AZ,85256
Peterson,Mason,A,"1812, avenue de l´Europe",Scottsdale,AZ,85256
Peterson,Natalie,M,1288 Vista Del Rio,Scottsdale,AZ,85256
Phillips,Blake,C,1466 Cherry St.,Scottsdale,AZ,85256
Phillips,Caleb,S,6887 Deerberry Ct.,Scottsdale,AZ,85256
Phillips,Haley,B,1039 Adelaide St.,Phoenix,AZ,85006
Phillips,Jose,C,1120 Jeff Ct.,Phoenix,AZ,85006
Phillips,Sophia,M,6883 Freda Drive,Phoenix,AZ,85006
Pinto,Paulo,S,6841 Monti Dr.,Phoenix,AZ,85006
Porter,Patricia,B.,685 St. Peter Court,Phoenix,AZ,85006
Posti,Juha-Pekka,C,2012 Reisling Court,Phoenix,AZ,85006
Powell,Cassidy,C,1367 Sheppard Way,Phoenix,AZ,85006
Powell,Dylan,M,1810 Darlene Dr.,Phoenix,AZ,85006
Powell,Lucas,T,6896 Liana Lane,Phoenix,AZ,85006
Prasad,Cesar,C,258 Bluejay Dr.,Phoenix,AZ,85006
Prasad,Cindy,C,1305 Black Point Pl.,Flagstaff,AZ,86011
Prasad,George,C,1240 Dayton Court,Flagstaff,AZ,86011
Prasad,Heidi,M,1534 Lanton Ave,Flagstaff,AZ,86011
Prasad,NaAZy,C,1881 Pinehurst Court,Flagstaff,AZ,86011
Prasad,Rebekah,A,1008 Lydia Lane,Scottsdale,AZ,85256
Prasad,Tabitha,D,1626 Green Valley Road,Tempe,AZ,85233
Price,Carson,C,154 Kentucky Dr.,Tempe,AZ,85233
Price,Haley,A,689 Kalima Place,Scottsdale,AZ,85256
Price,Lauren,J,1065 Almond St.,Scottsdale,AZ,85256
Price,Melissa,R,1561 Black Point Pl,Scottsdale,AZ,85256
Price,Vanessa,A,1412 San Marino Ct.,Scottsdale,AZ,85256
Raheem,Tommy,A,6872 Jimno Ave.,Scottsdale,AZ,85256
Rai,Alicia,M,1064 Armstrong Rd.,Scottsdale,AZ,85256
Rai,Brad,S,6793 Almond Street,Scottsdale,AZ,85256
Rai,Casey,M,1005 Tanager Court,Scottsdale,AZ,85256
Rai,Karl,M,1532 Marlene Dr.,Scottsdale,AZ,85256
Rai,Katrina,W,1752 Atrice Lane,Scottsdale,AZ,85256
Rai,Mario,H,1283 Teakwood Court,Scottsdale,AZ,85256
Rai,Melvin,J,1562 Black Walnut,Scottsdale,AZ,85256
Rai,Mindy,C,174 Carlotta,Scottsdale,AZ,85256
Rai,Sharon,C,1512 Orangewood Ave.,Scottsdale,AZ,85256
Raje,Bradley,L,6790 Falcon Dr.,Scottsdale,AZ,85256
Raje,Carl,J,1490 Daylight Pl.,Scottsdale,AZ,85256
Raje,Chad,A,2050 B Avenue I,Scottsdale,AZ,85256
Raje,Louis,M,1200 Rosemarie Pl,Scottsdale,AZ,85256
Raje,Michele,E,"107, rue des Bouchers",Phoenix,AZ,85025
Raje,Rafael,M,1142 Firestone Dr.,Phoenix,AZ,85025
Raji,Bonnie,C,1483 Santa Lucia Dr.,Phoenix,AZ,85025
Raji,Carly,L,1616 Kentucky Dr.,Phoenix,AZ,85025
Raji,Cassie,A,1657 Almond Avenue,Phoenix,AZ,85025
Raji,Kathryn,C,1522 Azalea Ave.,Phoenix,AZ,85025
Raji,Maurice,C,6896 Camino Norte,Flagstaff,AZ,86011
Raji,Nina,W,6791 Creekside Drive,Flagstaff,AZ,86011
Raman,Darren,K,1143 Julpum Loop,Flagstaff,AZ,86011
Raman,Ivan,S,189 Rae Anne Dr,Flagstaff,AZ,86011
Raman,Janelle,C,117 Marvello Lane,Flagstaff,AZ,86011
Raman,Joe,G,1527 St. John Lane,Flagstaff,AZ,86011
Raman,NaAZy,M,1753 Camby Rd.,Flagstaff,AZ,86011
Raman,Rachael,C,125 Keller Ridge,Flagstaff,AZ,86011
Raman,Troy,C,6879 Winthrop St.,Flagstaff,AZ,86011
Raman,Virginia,C,1097 Kulani Lane,Flagstaff,AZ,86011
Ramirez,Bryce,H,6837 Pirate Lane,Flagstaff,AZ,86011
Ramirez,Carlos,M,1751 Joan Ave.,Flagstaff,AZ,86011
Ramirez,Cole,E,1284 Poppy Pl.,Phoenix,AZ,85025
Ramirez,Hailey,C,6878 Dublin,Phoenix,AZ,85025
Ramirez,Julia,A,1538 Golden Meadow,Phoenix,AZ,85025
Ramirez,Katelyn,C,1386 Eastgate,Sun City,AZ,85374
Ramirez,Mason,K,1439 N. Michell Canyon Rd.,Sun City,AZ,85374
Ramirez,Morgan,P,1035 Arguello Blvd.,Sun City,AZ,85374
Ramos,Carolyn,C,1289 Quigley St.,Sun City,AZ,85374
Ramos,Ebony,C,1207 CoAZerto Circle,Sun City,AZ,85374
Ramos,Janet,B,133 Westwood Way,Phoenix,AZ,85006
Ramos,Joy,C,1069 Central Blvd.,Phoenix,AZ,85006
Ramos,LaAZe,S,1566 Eagle Ct.,Phoenix,AZ,85006
Ramos,Melinda,C,1201 St. FraAZis St.,Phoenix,AZ,85006
Ramos,Orlando,C,1461 Dantley Way,Phoenix,AZ,85006
Ramos,Paula,W,1247 Cardiff Dr.,Phoenix,AZ,85006
Ramos,Renee,K,1888 Buena Vista,Phoenix,AZ,85006
Ramos,Sheila,C,1256 Orangewood Ave.,Phoenix,AZ,85006
Rana,Candace,L,1733 Thistle Circle,Phoenix,AZ,85006
Rana,Manuel,C,1113 Ready Road,Phoenix,AZ,85006
Rana,Phillip,C,127 Daylight Pl.,Phoenix,AZ,85006
Rana,Ronald,C,1248 Tanager Cir,Phoenix,AZ,85006
Rana,Sergio,A,1063 Pinehurst Court,Scottsdale,AZ,85256
Rana,Shane,C,2055 Seawind Dr.,Scottsdale,AZ,85256
Rana,Summer,M,173 Soto St.,Scottsdale,AZ,85256
Rana,TerraAZe,M,1394 Firestone,Scottsdale,AZ,85256
Randall,Linda,A,1627 Alhambra Ave.,Scottsdale,AZ,85256
Reed,Alexa,C,1412 San Marino Ct.,Sun City,AZ,85374
Reed,Angela,K,1881 Pinehurst Court,Sun City,AZ,85374
Reed,Bailey,L,1754 D Mt. Hood Circle,Sun City,AZ,85374
Reed,Dalton,C,1667 Warren Street,Sun City,AZ,85374
Reed,Isaiah,O,1170 Shaw Rd,Sun City,AZ,85374
Reed,Jade,C,1245 Mesa Road,Sun City,AZ,85374
Reed,Juan,C,1407 Leslie Ave.,Sun City,AZ,85374
Reed,Natalie,C,1192 ToLVa Way,Sun City,AZ,85374
Reed,Sebastian,E,1739 Breaker Dr.,Phoenix,AZ,85025
Reed,Zoe,C,1371 VaAZouver Way,Phoenix,AZ,85025
Richardson,Bryce,C,1292 Marsh Elder,Phoenix,AZ,85025
Richardson,Mariah,C,6886 Berry Dr.,Phoenix,AZ,85025
Richardson,Melissa,E,1119 Elderwood Dr.,Phoenix,AZ,85025
Richardson,Paige,C,1372 Quartermaster,Phoenix,AZ,85025
Rivera,Adrian,C,1626 Green Valley Road,Phoenix,AZ,85025
Rivera,Brooke,L,1083 W. Hookston Road,Phoenix,AZ,85025
Rivera,Catherine,C,6793 Bonifacio St.,Phoenix,AZ,85025
Rivera,Chloe,R,1042 Hooftrail Way,Phoenix,AZ,85025
Rivera,Cole,R,1159 Lacassie Ave,Phoenix,AZ,85025
Rivera,Gabriella,C,1469 Babbe St.,Phoenix,AZ,85025
Rivera,Gabrielle,C,1509 Orangewood Ave.,Phoenix,AZ,85025
Rivera,Mason,M,1095 Collins Drive,Phoenix,AZ,85025
Rivera,Richard,L,1299 Carpetta Circle,Phoenix,AZ,85025
Rivera,Sara,C,1902 Santa Cruz,Phoenix,AZ,85025
Rivera,Stephanie,A,1292 Bola Raton Court,Scottsdale,AZ,85256
Roberts,Jack,E,"6861, rue Villedo",Phoenix,AZ,85025
Robinson,Alyssa,C,105 Woodruff Ln.,Sun City,AZ,85374
Robinson,Anthony,E,1026 Mt. Wilson Pl.,Phoenix,AZ,85025
Robinson,Austin,L,1723 Alvarado Dr,Phoenix,AZ,85025
Robinson,Miguel,C,6886 Berry Dr.,Phoenix,AZ,85025
Rodgers,LVott,M.,6894 Oeffler Ln.,Phoenix,AZ,85025
Rodriguez,Cynthia,E,1724 The Trees Drive,Phoenix,AZ,85025
Rodriguez,Emily,R,1495 Linnet Court,Phoenix,AZ,85025
Rodriguez,Harold,M,1028 Royal Oak Rd.,Phoenix,AZ,85025
Rodriguez,Ivan,H,1068 N Sweetbriar Court,Phoenix,AZ,85025
Rodriguez,James,J,2055 Fountain Road,Phoenix,AZ,85025
Rodriguez,Jennifer,T,6795 Moccasin Ct.,Phoenix,AZ,85025
Rodriguez,Johnathan,A,1084 Meadow Glen Way,Scottsdale,AZ,85256
Rodriguez,Phillip,S,139 LaAZelot Drive,Scottsdale,AZ,85256
Rodriguez,Raymond,A,1011 Yolanda Circle,Scottsdale,AZ,85256
Rodriguez,Richard,C,1903 Long Brook Way,Scottsdale,AZ,85256
Rodriguez,Sydney,C,1730 D Reliez Valley Ct.,Sun City,AZ,85374
Rodriguez,Tabitha,M,1517 Chisholm Way,Sun City,AZ,85374
Rodriguez,Virginia,C,6857 Bentley St.,Sun City,AZ,85374
Rodriguez,Xavier,C,1383 Bola Raton Court,Sun City,AZ,85374
Roessler,Don,A,1090 El Dorado Way,Scottsdale,AZ,85256
Rogers,Allison,C,6816 Detroit Ave.,Scottsdale,AZ,85256
Rogers,Brianna,C,6827 Seagull Court,Scottsdale,AZ,85256
Rogers,Bryce,C,1007 Cardinet Dr.,Scottsdale,AZ,85256
Rogers,Charles,C,1048 Las Quebradas Lane,Scottsdale,AZ,85256
Rogers,Christina,F,1750 Morengo Ct.,Scottsdale,AZ,85256
Rogers,Jasmine,K,1261 Sierrawood Court,Scottsdale,AZ,85256
Rogers,Morgan,B,1480 Oliveria Road,Phoenix,AZ,85006
Rogers,Paige,H,1488 Guadalupe,Phoenix,AZ,85006
Rogers,Steven,C,1060 Mcelroy Court,Phoenix,AZ,85006
Romero,Billy,C,117 Marvello Lane,Phoenix,AZ,85006
Romero,Daisy,M,1480 Shoenic,Phoenix,AZ,85006
Romero,Frank,M,1566 Eagle Ct.,Phoenix,AZ,85006
Romero,Kendra,C,205 Choctaw Court,Phoenix,AZ,85006
Romero,Shannon,J,1025 Yosemite Dr.,Phoenix,AZ,85006
Romero,Sheila,C,6871 Bel Air Dr.,Phoenix,AZ,85006
Romero,Theresa,C,1372 Quartermaster,Phoenix,AZ,85006
Ross,Alexia,S,6866 Winterberry Ct.,Phoenix,AZ,85006
Ross,Dylan,D,1218 Trasher Road,Tempe,AZ,85233
Ross,Jackson,A,1173 Dale Pl.,Scottsdale,AZ,85256
Ross,Jocelyn,C,1226 Linden Lane,Scottsdale,AZ,85256
Ross,Jordyn,C,1640 Windmill Way,Scottsdale,AZ,85256
Ross,Maria,C,6864 Oakleaf Ct.,Scottsdale,AZ,85256
Ross,Megan,R,1565 Esperanea Dr.,Scottsdale,AZ,85256
Ross,Samuel,T,1524 Reva Dr.,Scottsdale,AZ,85256
Rothkugel,Michael,L,1819 Weston Court,Scottsdale,AZ,85256
Rubio,Darren,C,6898 Roxie Lane,Scottsdale,AZ,85256
Rubio,Derrick,P,1091 Bloching Circle,Scottsdale,AZ,85256
Rubio,Desiree,D,1439 N. Michell Canyon Road,Tempe,AZ,85233
Rubio,Pedro,E,1040 Northridge Road,Tempe,AZ,85233
Rubio,Tanya,I,6797 Almondtree Circle,Tempe,AZ,85233
Ruiz,Adrienne,C,104 Hilltop Dr.,Tempe,AZ,85233
Ruiz,Anne,J,1267 Baltic Sea Ct.,Tempe,AZ,85233
Ruiz,Danny,C,1629 Queens Road,Tempe,AZ,85233
Ruiz,Gary,C,1002 N. Spoonwood Court,Tempe,AZ,85233
Ruiz,Gloria,C,"113, rue Ste-Honoré",Tempe,AZ,85233
Ruiz,Hector,C,1565 Esperanea Dr.,Tempe,AZ,85233
Ruiz,Jerome,J,1385 Panoramic Ave.,Tempe,AZ,85233
Ruiz,Melody,C,1475 Doyle,Tempe,AZ,85233
Ruiz,Nelson,C,6898 Shaw Rd.,Tempe,AZ,85233
Ruiz,Ricky,C,165 East Leland Road,Tempe,AZ,85233
Russell,Alexandra,H,68 Sunset Way,Tempe,AZ,85233
Russell,Ana,R,2008 Thors Bay Road,Tempe,AZ,85233
Russell,Brandon,C,1168 ELVobar,Tempe,AZ,85233
Russell,Cassidy,N,1522 Azalea Ave.,Tempe,AZ,85233
Russell,Hannah,A,1343 Grenola Dr.,Scottsdale,AZ,85256
Russell,Jose,J,1262 West Rd.,Scottsdale,AZ,85256
Russell,Julian,M,1048 Burwood Way,Scottsdale,AZ,85256
Russell,Nicole,M,1903 Vista Place,Scottsdale,AZ,85256
Russell,Olivia,C,6816 Piedra Dr.,Scottsdale,AZ,85256
Russell,Rachel,C,1099 C Street,Sun City,AZ,85374
Russell,Richard,C,125 Keller Ridge,Sun City,AZ,85374
Russell,Robert,L,1516 Nicholas Dr.,Sun City,AZ,85374
Russell,Samantha,C,1302 Martin St.,Sun City,AZ,85374
Russell,SpeAZer,C,"1011, avenue Foch",Sun City,AZ,85374
SaAZhez,Alex,K,1261 Deerfield Dr.,Scottsdale,AZ,85256
SaAZhez,Andre,C,152 LVenic Ave.,Scottsdale,AZ,85256
SaAZhez,Brenda,C,1728 Woodside Ct.,Scottsdale,AZ,85256
SaAZhez,Bryant,C,1569 Eagle Ct,Sun City,AZ,85374
SaAZhez,Cody,C,1515 Tuolumne St.,Sun City,AZ,85374
SaAZhez,Evan,R,1468 Napa St.,Sun City,AZ,85374
SaAZhez,Faith,C,1254 Sattler Dr.,Sun City,AZ,85374
SaAZhez,Joe,S,1087 Park Tree Ct.,Sun City,AZ,85374
SaAZhez,Martin,E,1178 Sandy Blvd.,Sun City,AZ,85374
SaAZhez,Nathaniel,C,1005 Tanager Court,Sun City,AZ,85374
SaAZhez,Shelby,C,1085 Ash Lane,Sun City,AZ,85374
SaAZhez,Thomas,T.,6843 San Simeon Dr.,Sun City,AZ,85374
SaAZhez,Toni,H,1299 Bundros Court,Sun City,AZ,85374
SáAZhez,Cesar,W,1474 Bentley Ct.,Sun City,AZ,85374
Sai,Allen,E,1164 Augustine Drive,Sun City,AZ,85374
Sai,Cassandra,R,1908 Petarct,Sun City,AZ,85374
Sai,Darren,E,1336 Terrace Road,Sun City,AZ,85374
Sai,Ivan,E,6850 Shadow Creek Dr.,Sun City,AZ,85374
Sai,Marie,A,1256 LiLVome Way,Scottsdale,AZ,85256
Sai,Ross,A,1296 Banyan Way,Scottsdale,AZ,85256
Sandberg,Brianna,T,6887 Deerberry Ct.,Sun City,AZ,85374
Sanders,Carlos,C,1481 Marina Blvd.,Sun City,AZ,85374
Sanders,Danielle,J,1355 Palm Avenue,Sun City,AZ,85374
Sanders,Jada,J,1509 American Beauty Dr.,Sun City,AZ,85374
Sanders,Jesse,C,6838 El RaAZho Drive,Sun City,AZ,85374
Sanders,Katelyn,A,6869 Shakespeare Drive,Scottsdale,AZ,85256
Sanders,Mason,G,"1406, rue Maillard",Scottsdale,AZ,85256
Sanders,Sara,D,1020 Carletto Drive,Tempe,AZ,85233
Sanders,Stephanie,A,2030 Lighthouse Way,Scottsdale,AZ,85256
Sanz,Leslie,N,6886 Melody Drive,Scottsdale,AZ,85256
Sanz,Monique,R,1019 Buchanan Road,Scottsdale,AZ,85256
Sanz,Reginald,K,1660 Bonifacio St.,Scottsdale,AZ,85256
Sanz,Tyrone,C,6898 Roxie Lane,Scottsdale,AZ,85256
Sanz,Wendy,C,1487 Nephi Court,Scottsdale,AZ,85256
Sara,Bruce,C,2050 Glazier Dr,Scottsdale,AZ,85256
Sara,Candace,C,1094 Loveridge Circle,Scottsdale,AZ,85256
Sara,Martin,C,1637 Kingston Pl.,Scottsdale,AZ,85256
Saunders,Cynthia,C,130 Alamo Court,Scottsdale,AZ,85256
Saunders,Jacquelyn,C,6821 Sepulveda Ct.,Scottsdale,AZ,85256
Saunders,Melody,R,1013 Holiday Hills Dr.,Scottsdale,AZ,85256
Serrano,Brandi,C,11 Sunrise Drive,Scottsdale,AZ,85256
Serrano,Jonathon,F,1050 Creed Ave,Scottsdale,AZ,85256
Serrano,Joy,L,1305 Willbrook Court,Scottsdale,AZ,85256
Serrano,Rodney,L,1224 Shoenic,Scottsdale,AZ,85256
Serrano,Roy,M,1345 Bloching Circle,Scottsdale,AZ,85256
Serrano,Teresa,C,105 Clark Creek Lane,Scottsdale,AZ,85256
Serrano,Theresa,C,1386 Calle Verde,Scottsdale,AZ,85256
Serrano,Wendy,D,1082 Crivello Avenue,Tempe,AZ,85233
Serventi,Alice,J.,1339 W. Hookston Road,Tempe,AZ,85233
Shan,Aaron,C,1519 Sheffield Place,Tempe,AZ,85233
Shan,Adam,A,1560 Harbor View Drive,Scottsdale,AZ,85256
Shan,Brendan,V,1039 Adelaide St.,Scottsdale,AZ,85256
Shan,Chad,M,1814 Angi Lane,Scottsdale,AZ,85256
Shan,Darrell,J,1086 Mesa Road,Scottsdale,AZ,85256
Shan,Dustin,C,1809 Candellero Dr.,Scottsdale,AZ,85256
Shan,Latoya,R,1144 Paraiso Ct.,Scottsdale,AZ,85256
Shan,Mesa,C,1296 Banyan Way,Scottsdale,AZ,85256
Shan,Misty,C,1410 N RaAZhford Court,Scottsdale,AZ,85256
Shan,Sheena,J,1613 Santa Maria,Scottsdale,AZ,85256
Sharma,Alvin,M,1132 Plymouth Dr.,Scottsdale,AZ,85256
Sharma,Cedric,A,1293 Silverwood Drive,Scottsdale,AZ,85256
Sharma,Deborah,R,1466 Aspen Drive,Scottsdale,AZ,85256
Sharma,Jack,C,1252 Deer Ridge Way,Scottsdale,AZ,85256
Sharma,Kurt,C,6870 D Bel Air Drive,Scottsdale,AZ,85256
Sharma,Lindsay,E,1725 La Salle Ave.,Scottsdale,AZ,85256
Sharma,PriLVilla,E,6852 Elderwood Drive,Scottsdale,AZ,85256
She,Ashlee,C,1292 Bola Raton Court,Scottsdale,AZ,85256
She,BritNMey,M,1289 Mt. Dias Blv.,Scottsdale,AZ,85256
She,Colin,M,104 Hilltop Dr.,Scottsdale,AZ,85256
She,Kara,C,1078 Aloe Vera Road,Scottsdale,AZ,85256
She,Kurt,C,107 Woodside Court,Scottsdale,AZ,85256
She,Russell,C,1002 N. Spoonwood Court,Scottsdale,AZ,85256
She,Susan,C,1389 Walters Way,Scottsdale,AZ,85256
Shen,Bridget,C,1657 Almond Avenue,Scottsdale,AZ,85256
Shen,Jaime,C,1519 Mark Twain Dr.,Scottsdale,AZ,85256
Shen,Julie,C,1393 Winterberry Ct.,Scottsdale,AZ,85256
Shen,Latoya,S,204 Longbrook Way,Scottsdale,AZ,85256
Shen,Marshall,M,1160 Via Del Sol,Scottsdale,AZ,85256
Simmons,Aaron,C,6868 Firestone,Scottsdale,AZ,85256
Simmons,Ashley,R,137 LaAZelot Dr,Scottsdale,AZ,85256
Simmons,Destiny,V,6899 Pembroke Dr.,Scottsdale,AZ,85256
Simmons,Dylan,C,6885 Auburn,Scottsdale,AZ,85256
Simmons,Julia,C,1374 Wightman Lane,Scottsdale,AZ,85256
Simmons,Melanie,T,1616 East Leland,Scottsdale,AZ,85256
Simmons,Thomas,C,1378 California St.,Scottsdale,AZ,85256
Simpson,Mindy,A,15 Aspen Drive,Scottsdale,AZ,85256
Slaven,Lanna,A.,6853 Hacienda,Scottsdale,AZ,85256
Smith,Edward,C,6812 Semillon Circle,Scottsdale,AZ,85256
Smith,Kari,A,2577 Dover Way,Scottsdale,AZ,85256
Smith,Katherine,J,1291 Arguello Blvd.,Scottsdale,AZ,85256
Smith,Peggy,R.,1206 San Simeon Drive,Scottsdale,AZ,85256
Smith,Phillip,S,1374 Queens Road,Scottsdale,AZ,85256
Smith,Samantha,J,1739 Sun View Terr,Scottsdale,AZ,85256
Smith,Tyler,J,115 Santa Fe Street,Scottsdale,AZ,85256
Srini,Brett,D,1511 Roxbury Drive,Mesa,AZ,85204
Srini,Donald,C,1217 Mariposa,Mesa,AZ,85204
Srini,Troy,C,6827 Seagull Court,Mesa,AZ,85204
Steel,Merrill,R.,1141 Hale Court,Mesa,AZ,85204
Steele,Joan,P.,1013 Holiday Hills Dr.,Mesa,AZ,85204
Stewart,Abigail,C,1468 Dover Drive,Mesa,AZ,85204
Stewart,Andrea,M,1105 Meadowbrook Drive,Mesa,AZ,85204
Stewart,Devin,E,1102 Geary Ct,Mesa,AZ,85204
Stewart,Kaitlyn,A,1121 Ferry Street,Mesa,AZ,85204
Stewart,Katelyn,K,1064 Diver Way,Mesa,AZ,85204
Stewart,Marcus,R,6791 Creekside Drive,Mesa,AZ,85204
Stewart,Maria,D,6790 Falcon Dr.,Mesa,AZ,85204
Stone,Keith,C,6854 Veale Ave.,Mesa,AZ,85204
Stone,Megan,L,1028 Indigo Ct.,Mesa,AZ,85204
Stotler,Kayla,M.,1102 Ravenwood,Mesa,AZ,85204
Suarez,Adrienne,C,1201 Paso Del Rio Way,Mesa,AZ,85204
Suarez,Beth,K,1726 ChesNMut,Mesa,AZ,85204
Suarez,Casey,C,1883 Cowell Rd.,Mesa,AZ,85204
Suarez,Jessie,D,1058 Miwok Way,Mesa,AZ,85204
Suarez,LaAZe,C,1485 La Vista Avenue,Tuscon,AZ,85756
Suarez,Larry,D,1133 Leisure Lane,Tuscon,AZ,85756
Suarez,Marvin,M,1658 Stonyhill Circle,Tuscon,AZ,85756
Suarez,Neil,C,1099 C Street,Tuscon,AZ,85756
Suarez,Roberto,D,1739 Breaker Dr.,Tuscon,AZ,85756
Suarez,Theodore,C,1906 Adobe Dr.,Tuscon,AZ,85756
Suarez,Wendy,C,6813 Morning Way,Tuscon,AZ,85756
Subram,Chelsea,C,1050 Greenhills Circle,Tuscon,AZ,85756
Subram,Geoffrey,L,1023 Riveria Way,Tuscon,AZ,85756
Subram,Kari,C,1883 Cowell Rd.,Tuscon,AZ,85756
Subram,Mayra,C,1901 Mitchell Canyon Court,Tuscon,AZ,85756
Subram,Pedro,C,1052 Stanford Street,Tuscon,AZ,85756
Subram,Virginia,C,6790 Loma Linda,Tuscon,AZ,85756
Suess,Gary,J.,1092 Pinole Valley Rd.,Tuscon,AZ,85756
Sullivan,Henry,L,1906 Twinview Place,Tuscon,AZ,85756
Sun,BritNMey,C,6897 Deerfield Dr.,Tuscon,AZ,85756
Sun,Cara,E,1479 Pine Creek Way,Tuscon,AZ,85756
Sun,Colin,J,1105 Meadowbrook Drive,Tuscon,AZ,85756
Sun,Stacey,S,1903 Vista Place,Tuscon,AZ,85756
Suri,Ann,C,156 Ulfinian Way,Tuscon,AZ,85756
Suri,Carmen,E,1340 Starlyn Dr.,Tuscon,AZ,85756
Suri,Donald,C,2038 SundaAZe Drive,Tuscon,AZ,85756
Suri,Holly,M,1755 Winton Drive,Tuscon,AZ,85756
Suri,Kristopher,M,1023 Hawkins Street,Tuscon,AZ,85756
Suri,TerraAZe,C,1229 Harness Circle,Tuscon,AZ,85756
Tang,Brad,C,1098 Lawton Street,Tuscon,AZ,85756
Tang,Casey,C,1147 Dimaggio Way,Tuscon,AZ,85756
Tang,Colleen,A,1246 Glenside Ct.,Scottsdale,AZ,85256
Tang,Dale,A,1040 Greenbush Drive,Scottsdale,AZ,85256
Tang,Damien,C,1106 Pine Creek Way,Scottsdale,AZ,85256
Tang,Karl,C,1401 Via Alta,Scottsdale,AZ,85256
Tang,Kelsey,C,6878 D Mt. Hood Circle,Scottsdale,AZ,85256
Tang,Leonard,L,1538 Mt. Diablo St.,Scottsdale,AZ,85256
Tang,TerreAZe,R,1071 Stanz Grace St.,Scottsdale,AZ,85256
Tang,Warren,A,684 Marsh Creek Rd.,Scottsdale,AZ,85256
Taylor,Denis,C,6872 Sandalwood Dr.,Scottsdale,AZ,85256
Taylor,Grace,C,2000 Newcastle Road,Scottsdale,AZ,85256
Taylor,John,C,1224 Shoenic,Scottsdale,AZ,85256
Taylor,Seth,R,1283 Cowell Rd.,Scottsdale,AZ,85256
Taylor,Zachary,M,1069 Bynum Way,Scottsdale,AZ,85256
Tejani,Sameer,A.,175 Loeffler Lane,Scottsdale,AZ,85256
Thomas,Ashley,J,6837 Weber Bryan St.,Scottsdale,AZ,85256
Thomas,Charles,C,1537 Teakwood Court,Scottsdale,AZ,85256
Thomas,Justin,J,6866 Franklin Canyon Rd.,Scottsdale,AZ,85256
Thompson,Austin,C,1063 Pinehurst Court,Scottsdale,AZ,85256
Thompson,Chloe,M,6836 Alum Rock Drive,Scottsdale,AZ,85256
Thompson,Dalton,Y,1217 Mariposa,Scottsdale,AZ,85256
Thompson,Logan,T,121 Rotherham Dr.,Scottsdale,AZ,85256
Thompson,Richard,C,162 Frisbie Court,Scottsdale,AZ,85256
Thompson,Ryan,M,102 Vista Place,Scottsdale,AZ,85256
Thomsen,Andrea,A.,1617 Cunningham Way,Scottsdale,AZ,85256
Torres,Beth,C,6896 Liana Lane,Scottsdale,AZ,85256
Torres,Chloe,D,2008 Storey Lane,Mesa,AZ,85204
Torres,Christina,M,1513 Deercreek Ln.,Mesa,AZ,85204
Torres,Cole,A,2049 Jason Court,Mesa,AZ,85204
Torres,Evan,C,1104 Colton Ln,Mesa,AZ,85204
Torres,FraAZis,C,1264 Eureka Lane,Mesa,AZ,85204
Torres,Gabrielle,T,1526 Courthouse Drive,Mesa,AZ,85204
Torres,Isaiah,E,6828 Benedict Court,Mesa,AZ,85204
Torres,Janet,A,1055 Horseshoe Road,Mesa,AZ,85204
Torres,Javier,R,166 Birchbark Place,Mesa,AZ,85204
Torres,Katelyn,L,1471 Michigan Blvd.,Mesa,AZ,85204
Torres,Mackenzie,C,1020 Carletto Drive,Mesa,AZ,85204
Torres,Randall,C,1745 Chickpea Ct,Mesa,AZ,85204
Torres,Robin,H,1117 Diablo View Road,Mesa,AZ,85204
Torres,Robyn,C,1479 Megan Dr,Mesa,AZ,85204
Torres,Stacy,A,1077 Pheasant Drive,Scottsdale,AZ,85256
Torres,Tabitha,C,1889 Carmel Dr,Scottsdale,AZ,85256
Torres,Zoe,E,1371 VaAZouver Way,Scottsdale,AZ,85256
Townsend,Trinity,L,6885 Auburn,Scottsdale,AZ,85256
Travers,Linda,C,1619 Stillman Court,Scottsdale,AZ,85256
Trenary,Jean,E,1019 Kenwal Rd.,Scottsdale,AZ,85256
Trolen,David,F.,6837 Weber Bryan St.,Scottsdale,AZ,85256
Turner,Alexandra,C,1511 Roxbury Drive,Scottsdale,AZ,85256
Turner,Amber,C,1045 Lolita Drive,Scottsdale,AZ,85256
Turner,Charles,C,2046 Las Palmas,Scottsdale,AZ,85256
Turner,Eric,B,6843 San Simeon Dr.,Phoenix,AZ,85006
Turner,Gabriella,M,"1801, boulevard d´Albi",Phoenix,AZ,85006
Turner,Isaiah,M,1742 Breck Court,Phoenix,AZ,85006
Turner,Judith,A,1384 Windmill Way,Phoenix,AZ,85006
Turner,Katherine,C,1029 Birchwood Dr,Phoenix,AZ,85006
Turner,Noah,S,181 Gainsborough Drive,Phoenix,AZ,85006
Uppal,Sunil,L,6872 Thornwood Dr.,Phoenix,AZ,85006
VaAZe,Denise,L,1399 Firestone Drive,Phoenix,AZ,85006
VaAZe,Patricia,L,"151, rue Jean Mermoz",Phoenix,AZ,85006
VaAZe,Tina,C,1400 Gibrix Drive,Phoenix,AZ,85006
Valdez,Rachel,B,2040 EAZino Drive,Phoenix,AZ,85006
Van,Brett,C,1226 Shoenic,Phoenix,AZ,85006
Vazquez,Jimmy,D,1902 Santa Cruz,Mesa,AZ,85204
Vazquez,Nelson,D,1220 Bradford Way,Mesa,AZ,85204
Venugopal,Raja,D.,1064 Slavio,Yuma,AZ,85364
Walker,Brandon,J,1306 Kaski Ln,Yuma,AZ,85364
Walker,Fernando,R,1342 Isla Bonita,Yuma,AZ,85364
Walker,Hazel,R.,1143 Julpum Loop,Yuma,AZ,85364
Walker,John,M,144 Castro Street,Yuma,AZ,85364
Walker,Natalie,C,1397 Paraiso Ct.,Yuma,AZ,85364
Wang,Colin,R,6898 Shaw Rd.,Yuma,AZ,85364
Wang,Curtis,A,1160 Camelback Road,Scottsdale,AZ,85256
Wang,Franklin,S,1013 Buchanan Rd,Scottsdale,AZ,85256
Wang,Jon,A,1102 Ravenwood,Scottsdale,AZ,85256
Wang,Kyle,C,2035 Emmons Canyon Lane,Scottsdale,AZ,85256
Wang,Tamara,L,2059 Brookdale Dr,Scottsdale,AZ,85256
Wang,Trisha,V,1356 Grove Way,Scottsdale,AZ,85256
Ward,Allison,C,1061 Buskrik Avenue,Scottsdale,AZ,85256
Ward,Charles,C,1107 La Corte Bonita,Scottsdale,AZ,85256
Ward,Christina,H,1880 Birchwood,Scottsdale,AZ,85256
Ward,Haley,J,1666 Edward Avenue,Scottsdale,AZ,85256
Ward,Isaiah,C,6819 Meadow Lane,Scottsdale,AZ,85256
Ward,Lauren,C,6793 Bonifacio St.,Scottsdale,AZ,85256
Washington,Adam,G,1736 Windsor Drive,Scottsdale,AZ,85256
Washington,Benjamin,D,6863 Shakespeare Dr,Mesa,AZ,85204
Washington,Chloe,W,1132 San ViAZente Drive,Mesa,AZ,85204
Washington,Grace,A,2034 Rose Dr.,Mesa,AZ,85204
Washington,Hannah,A,1019 Mt. Davidson Court,Mesa,AZ,85204
Washington,Hunter,C,1240 Hitchcock,Mesa,AZ,85204
Washington,Jacqueline,C,"1509, rue Maillard",Tuscon,AZ,85756
Washington,Joan,C,1487 Franklin Canyon Road,Tuscon,AZ,85756
Washington,Ryan,C,1888 Buena Vista,Tuscon,AZ,85756
Washington,Samuel,A,1227 Wesley Court,Scottsdale,AZ,85256
Washington,Sarah,C,1013 Buchanan Rd,Tuscon,AZ,85756
Washington,Tristan,A,1654 Bonari Court,Tuscon,AZ,85756
Watson,Andrea,G,1408 Bonifacio St.,Tuscon,AZ,85756
Watson,Brianna,C,1267 LVenic Drive,Tuscon,AZ,85756
Watson,Cole,A,1614 Green St,Tuscon,AZ,85756
Watson,Danielle,C,1908 San Jose Ave,Tuscon,AZ,85756
Watson,Kaitlyn,R,1208 Dos EAZinas,Tuscon,AZ,85756
Watson,Kaylee,K,6853 Hacienda,Tuscon,AZ,85756
Watson,Stephanie,R,1307 Horseshoe Circle,Tuscon,AZ,85756
Watson,Taylor,C,1191 Boxwood Dr.,Tuscon,AZ,85756
Watson,Trinity,H,2035 Shelly Dr,Tuscon,AZ,85756
West,Alyssa,C,1190 Hill Top Rd.,Tuscon,AZ,85756
West,Nathan,C,1747 Corte Segundo,Tuscon,AZ,85756
White,Abigail,T,1536 Camino Verde Ct.,Tuscon,AZ,85756
White,Emma,N,1005 Valley Oak Plaza,Tuscon,AZ,85756
White,Jacob,K,6841 Curletto Dr.,Tuscon,AZ,85756
White,Jonathan,A,1565 W. Lake Dr.,Scottsdale,AZ,85256
White,Nicole,C,1368 Palms Drive,Scottsdale,AZ,85256
White,Richard,C,6876 Winthrop Street,Scottsdale,AZ,85256
White,Taylor,D,1755 Winton Drive,Mesa,AZ,85204
White,Tyler,C,"1402, rue Lauriston",Mesa,AZ,85204
Whitworth,Kelly,J.,1411 Moretti Drive,Mesa,AZ,85204
Williams,Anna,R,6897 Pome Court,Mesa,AZ,85204
Williams,Anthony,V,"1039, rue Mazagran",Mesa,AZ,85204
Williams,Dylan,T,6835 Lynwood Drive,Mesa,AZ,85204
Williams,Eduardo,C,1192 A St.,Mesa,AZ,85204
Williams,Madison,J,6828 Willow Pass Road,Mesa,AZ,85204
Williams,Samantha,C,181 Buena Vista,Phoenix,AZ,85003
Wilson,Andrew,R,1075 San Miguel Circle,Phoenix,AZ,85003
Wilson,Dan,C,682 Ada Dr.,Phoenix,AZ,85003
Wilson,Emily,C,1061 Delta Fair Blvd.,Phoenix,AZ,85003
Wilson,Joshua,A,1488 Cambelback Place,Phoenix,AZ,85003
Wollesen,Dorothy,M.,679 Pepperidge Way,Phoenix,AZ,85003
Wood,Dakota,N,6833 Filomena,Phoenix,AZ,85003
Wood,Emily,C,1288 Mt. Dias Blvd.,Phoenix,AZ,85003
Wood,Ian,C,1239 Linnet Court,Phoenix,AZ,85003
Wood,Maria,C,1148 Thornwood Drive,Phoenix,AZ,85003
Wood,SpeAZer,R,6827 Glazier Dr.,Phoenix,AZ,85003
Word,Sheela,H,1047 Las Quebradas Lane,Phoenix,AZ,85003
Word,Sheela,C,1260 Mt. Washington Way,Phoenix,AZ,85003
Wright,Amanda,C,1060 Mcelroy Court,Phoenix,AZ,85003
Wright,Amber,L,1161 Pine Hollow Road,Phoenix,AZ,85003
Wright,Bailey,L,1487 Franklin Canyon Road,Phoenix,AZ,85003
Wright,Connor,C,6899 Pembroke Dr.,Phoenix,AZ,85003
Wright,David,C,1086 Mesa Road,Phoenix,AZ,85003
Wright,Jackson,C,1742 Breck Court,Phoenix,AZ,85003
Wright,James,A,205 Park Blvd.,Scottsdale,AZ,85256
Wright,Jennifer,C,1201 Olive Hill,Scottsdale,AZ,85256
Wright,Kaitlyn,G,1512 Birch Bark Dr,Scottsdale,AZ,85256
Wright,Lucas,C,6868 West,Scottsdale,AZ,85256
Wright,Marcus,C,1569 Norse Drive,Scottsdale,AZ,85256
Wright,Mary,P,1355 Sequoia Drive,Scottsdale,AZ,85256
Wright,Sydney,S,"6861, rue Villedo",Scottsdale,AZ,85256
Wu,Alisha,C,1025 R St.,Scottsdale,AZ,85256
Wu,Edwin,F,2012 Reisling Court,Scottsdale,AZ,85256
Wu,Jake,E,1371 Rogers Ave,Scottsdale,AZ,85256
Wu,Jamie,S,1058 Kirker Pass Road,Scottsdale,AZ,85256
Wu,Jessie,L,1644 Alicante Court,Scottsdale,AZ,85256
Wu,Shannon,F,1902 E. 42nd Street,Scottsdale,AZ,85256
Wu,Valerie,C,1258 Yeoman Dr,Scottsdale,AZ,85256
Xie,Gilbert,C,1624 Carlisle Way,Scottsdale,AZ,85256
Xie,Karl,V,6852 Elderwood Drive,Scottsdale,AZ,85256
Xie,Tara,C,182 Perry Way,Scottsdale,AZ,85256
Xie,Tommy,J,1907 Pinecrest Dr,Scottsdale,AZ,85256
Xu,Barbara,C,"151, rue de la Centenaire",Scottsdale,AZ,85256
Xu,Casey,J,1121 Boynton Avenue,Scottsdale,AZ,85256
Xu,Erica,M,1563 Weston Court,Scottsdale,AZ,85256
Xu,Kate,R,1111 Bayview Cr,Scottsdale,AZ,85256
Xu,Katie,R,1407 Leslie Ave.,Scottsdale,AZ,85256
Xu,Kelvin,C,2050 Glazier Dr,Scottsdale,AZ,85256
Xu,Marshall,K,1300 Zartop Street,Scottsdale,AZ,85256
Xu,PriLVilla,E,1059 Kirkwood Ct,Scottsdale,AZ,85256
Yang,Claudia,C,1386 Fillet Ave.,Scottsdale,AZ,85256
Yang,Crystal,A,1660 Bonifacio St.,Scottsdale,AZ,85256
Yang,Curtis,C,1403 Mcmillan Ave.,Scottsdale,AZ,85256
Yang,Jessie,E,1218 Woodside Court,Scottsdale,AZ,85256
Yang,Jon,V,162 Maureen Lane,Scottsdale,AZ,85256
Yang,Jordan,K,1657 Morengo Ct.,Scottsdale,AZ,85256
Yang,Logan,M,1073 Bonnie Lane,Scottsdale,AZ,85256
Yang,Luis,C,1259 Ygnacio Valley Road,Scottsdale,AZ,85256
Yang,Mandy,C,1395 Bonanza,Scottsdale,AZ,85256
Yang,Omar,C,1206 San Simeon Drive,Scottsdale,AZ,85256
Yang,Rafael,A,1025 Holly Oak Drive,Scottsdale,AZ,85256
Yang,Randy,E,1246 Glenside Ct.,Scottsdale,AZ,85256
Ye,Amy,C,1371 Rogers Ave,Scottsdale,AZ,85256
Ye,Christy,C,1460 Jasper Court,Scottsdale,AZ,85256
Ye,Shannon,D,160 Kentucky Drive,Mesa,AZ,85204
Ye,Trisha,R,1147 Mellowood Street,Mesa,AZ,85204
Young,Henry,C,1343 Apple Drive,Mesa,AZ,85204
Young,Jeremy,C,2059 Brookdale Dr,Mesa,AZ,85204
Young,Samuel,C,"148, avenue du Québec",Mesa,AZ,85204
Young,Sara,C,6891 Relis Valley Road,Mesa,AZ,85204
Young,Savannah,C,1247 Violet Ct,Mesa,AZ,85204
Young,Timothy,C,1644 Via Media,Mesa,AZ,85204
Yuan,Arturo,C,1342 Isla Bonita,Mesa,AZ,85204
Yuan,Bonnie,H,1174 Royal Ann Lane,Mesa,AZ,85204
Yuan,Colleen,M,1463 LiAZoln Dr,Mesa,AZ,85204
Yuan,Corey,C,1226 Shoenic,Mesa,AZ,85204
Yuan,Michele,L,1168 ELVobar,Mesa,AZ,85204
Yuan,Terry,R,1127 Wellington Avenue,Mesa,AZ,85204
Yuhasz,Ian,A.,6814 Gatewood Court,Scottsdale,AZ,85256
Yvkoff,Greg,C,6854 Veale Ave.,Scottsdale,AZ,85256
Zeng,Alisha,A,1301 Burwood Way,Scottsdale,AZ,85256
Zeng,Mandy,C,1092 Boxer Blvd,Scottsdale,AZ,85256
Zeng,Randy,A,1265 Gloria Terr.,Scottsdale,AZ,85256
Zeng,Stacey,J,1132 Plymouth Dr.,Scottsdale,AZ,85256
Zeng,Steve,C,127 Daylight Pl.,Scottsdale,AZ,85256
Zhang,Barbara,C,1726 Hacienda,Scottsdale,AZ,85256
Zhang,Christian,D,108 Lakeside Court,Scottsdale,AZ,85256
Zhang,Darryl,J,6891 Ham Drive,Scottsdale,AZ,85256
Zhang,Dylan,L,137 Mazatlan,Scottsdale,AZ,85256`;

// Split the input list by newline character to get individual entries
const entries = inputList.split("\n");

// Process each entry and convert it into an array
const convertedData = entries.map((entry) => entry.split(","));

// Email to be added to each entry
const email = "willkimball99@gmail.com";

function convertDataToJSON(data: any[], email: any) {
  const jsonObjects = data.map((entry) => {
    const [
      lastName,
      firstName,
      middleInitial,
      streetAddress,
      city,
      state,
      postalCode,
    ] = entry;
    const fullName = `${firstName} ${middleInitial} ${lastName}`;
    const address = {
      line1: streetAddress,
      line2: "",
      city: city,
      state: state,
      postal_code: postalCode,
    };
    return {
      name: fullName,
      address: address,
      email: email,
    };
  });

  return jsonObjects;
}

// export async function checkoutWithStripe(
//   price: Price,
//   redirectPath: string = "/account"
// ): Promise<CheckoutResponse> {
//   try {
//     // Get the user from Supabase auth
//     const supabase = createClient();
//     const {
//       error,
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (error || !user) {
//       console.error(error);
//       throw new Error("Could not get user session.");
//     }

//     // Retrieve or create the customer in Stripe
//     let customer: string;
//     try {
//       customer = await createOrRetrieveCustomer({
//         uuid: user?.id || "",
//       });
//     } catch (err) {
//       console.error(err);
//       throw new Error("Unable to access customer record.");
//     }

//     let params: Stripe.Checkout.SessionCreateParams = {
//       allow_promotion_codes: true,
//       billing_address_collection: "required",
//       customer,
//       customer_update: {
//         address: "auto",
//       },
//       line_items: [
//         {
//           price: price.id,
//           quantity: 1,
//         },
//       ],
//       cancel_url: getURL(),
//       success_url: getURL(redirectPath),
//     };

//     console.log(
//       "Trial end:",
//       calculateTrialEndUnixTimestamp(price.trial_period_days)
//     );
//     if (price.type === "recurring") {
//       params = {
//         ...params,
//         mode: "subscription",
//         subscription_data: {
//           trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
//         },
//       };
//     } else if (price.type === "one_time") {
//       params = {
//         ...params,
//         mode: "payment",
//       };
//     }

//     // Create a checkout session in Stripe
//     let session;
//     try {
//       session = await stripe.checkout.sessions.create(params);
//     } catch (err) {
//       console.error(err);
//       throw new Error("Unable to create checkout session.");
//     }

//     // Instead of returning a Response, just return the data or error.
//     if (session) {
//       return { sessionId: session.id };
//     } else {
//       throw new Error("Unable to create checkout session.");
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       return {
//         errorRedirect: getErrorRedirect(
//           redirectPath,
//           error.message,
//           "Please try again later or contact a system administrator."
//         ),
//       };
//     } else {
//       return {
//         errorRedirect: getErrorRedirect(
//           redirectPath,
//           "An unknown error occurred.",
//           "Please try again later or contact a system administrator."
//         ),
//       };
//     }
//   }
// }
export async function retrieveCustomer({
  // customerId,
  id,
}: {
  // customerID: string;
  id: string;
}) {
  const existingStripeCustomer = await stripe.customers.retrieve(id);

  if (!!existingStripeCustomer) {
    return JSON.parse(JSON.stringify(existingStripeCustomer));
  }
  return { error: "customer not found" };
}

export async function retrieveCustomerInvoices({
  // customerId,
  id,
}: {
  // customerID: string;
  id: string;
}) {
  const { data: stripeCustomerInvoices } = await stripe.invoices.list({
    customer: id,
  });

  if (!!stripeCustomerInvoices) {
    return JSON.parse(JSON.stringify(stripeCustomerInvoices));
  }
  return { error: "invoices not found" };
}
export async function createCustomerInvoice(customer: any) {
  const updatedCustomer = {
    ...customer,
    collection_method: "send_invoice",
    auto_advance: false,
    days_until_due: 30,
  };

  const invoice = await stripe.invoices.create(updatedCustomer);
  if (!!invoice) {
    return invoice.id;
  }
  return "";
}

export async function finalizeInvoice(invoiceId: any) {
  const invoiceFinal = await stripe.invoices.finalizeInvoice(invoiceId);
  if (invoiceFinal) {
    const invoice = await stripe.invoices.sendInvoice(invoiceId);
    return invoice;
  }
  return "";
}

export async function createCustomerLineItem(
  invoiceId: any,
  tableData: any[],
  supabaseCustomer: any
) {
  const lineItems = tableData.map(async (item) => {
    const lineItem = {
      customer: supabaseCustomer.id,
      price: item.price_id,
      quantity: item.quantity,
      invoice: invoiceId,
    };
    const invoiceItem = await stripe.invoiceItems.create(lineItem);
  });
  if (!!lineItems) {
    return JSON.parse(JSON.stringify(lineItems));
  }
  return { error: "invoice item not created" };
}

export async function createStripePortal(
  currentPath: string,
  customerId: string | null
) {
  try {
    try {
      console.log(currentPath);
      const { url } = await stripe.billingPortal.sessions.create({
        customer: customerId!,
        return_url: getURL(currentPath),
      });
      if (!url) {
        throw new Error("Could not create billing portal");
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error("Could not create billing portal");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        "Please try again later or contact a system administrator."
      );
    } else {
      return getErrorRedirect(
        currentPath,
        "An unknown error occurred.",
        "Please try again later or contact a system administrator."
      );
    }
  }
}
export async function createCustomerInStripe({
  name,
  email,
  address,
  phone,
}: {
  name: string;
  email: string;
  address: any;
  phone: string;
}) {
  const customerData = {
    name: name,
    email: email,
    address: address,
    phone: phone,
  };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error("Stripe customer creation failed.");

  return newCustomer.id;
}

export async function createAllCustomersInStripe() {
  const jsonData = convertDataToJSON(convertedData, email);

  try {
    const batches: any[] = chunkArray(jsonData, 20); // Split jsonDataArray into batches of 20 customers each

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const customerCreationPromises = batch.map(async (customerData: any) => {
        const newCustomer = await stripe.customers.create(customerData);
        console.log("Created customer:", newCustomer.id);
        return newCustomer;
      });

      await Promise.all(customerCreationPromises);

      // Introduce a 2-second delay after every batch
      if (i < batches.length - 1) {
        await delay(1000); // 2000 milliseconds = 2 seconds
      }
    }

    console.log("All customers created successfully.");
  } catch (error) {
    console.error("Error creating customers:", error);
    throw error;
  }
}

// Function to chunk an array into smaller arrays of specified size
function chunkArray(array: string | any[], size: number) {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }
  return chunkedArray;
}

// Function to introduce delay using setTimeout
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
