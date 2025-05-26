# Welcom to the Yatch Club Project Introduction Page
![표지01](https://github.com/user-attachments/assets/0eed86a0-9f71-481c-8c3c-859dd86fbdd3)

# Overview
![Intro](https://github.com/user-attachments/assets/e5e23d39-21eb-4b68-b98f-dae29d5b2b7d)

Yat Clubs is a community of enthusiasts who seek to enjoy the life on a Yacht. The ecosystem evolves around $YAT token which serves as the utility memecoin to provide access to the exclusive community events. We believe that life is much better when we are able to enjoy the opulence with the like minded community.

# Problem
![Problem](https://github.com/user-attachments/assets/0699265a-eb7c-4af7-960c-8654b98b49c5)

Yacht party is long considered as one of the most refined taste of lifestyle. However, the industry suffers from the lack of growth for the following reasons:

* **Price**: It is too expensive for an individual to enjoy a high end Yacht. Owning a yacht cost way more than other high end good whereas even one time access is too pricy
* **Complexity**: Owning a yacht requires a lot of paper work and maintenance. Also, handling legal issues makes it harder transfer the ownership
* **Interoperability**: Unlike luxury hotels or golf resort, yachts do not come with other perks and services that supports high end lifestyle

In short, yacht is a heavy asset to enjoy. Although many can envy it’s lifestyle, most people shun away from it due to the higher opportunity cost

# Solution
![Solution](https://github.com/user-attachments/assets/0eafcd13-92d9-461d-8853-a498c178c7bd)

Yat Clubs makes enjoying the yacht much lighter through token based membership. Instead of the traditional way of owning and attending yacht event, community members experience:

* **Affordability:** Service users can join a high end yacht party at a price of attending a club party. Through membership, it is much more affordable to even rent a yacht
* **Accessibility:** One can access the yacht event anywhere provided by the best yacht owners. They can event rent it for themselves like resorts and condominiums
* **Asset Interoperability:** Token based membership allows other luxury services such as hotels, golf, fine dinning, and other experiences to onboard to the club

Through Yat Club, more community members can access the luxurious lifestyle of a yacht owner at a much affordable price and a wider range of services

# System Architecture
![Yat Portal](https://github.com/user-attachments/assets/a0324659-d480-4d8e-b53e-63e3bb6ab85a)

Yat Club Portal is the platform where service providers (ie. Yacht Owners) and users (ie. Yatch party enjoyers) interact. There are four primary features:

* **Yat Club Creates Event**: Yat Club Admin announce the event details including the date, place, price and other information
* **Users Reserve the Event**: Users login and reserve the event that they would like to join. For the reservation, users need to make payment through Fiat / $SOL / $YAT or platform points
* **Yat Club Receive the Amount**: The amount is received to Yat Club Treasury. Fiat payment is transferred as $SOL through Stripe API. Club makes payment to the service providers and the rest is stored in the treasury
* **Users Participate the Event**: Users come to the event to enjoy the party. Onsite checkers can check the reservation through the portal. Participations are recorded

## Additional Considerations
![Tech Stacks](https://github.com/user-attachments/assets/5f2cce8c-7346-4c20-8697-0858105321ea)

Yat Club portal is a event reservation service before a Web3 project. For this, the most important consideration remains ease of use with good user experience. Followings are the key considerations for the first Yat Club Portal:

* **Mobile First**: We expect that most of the event reservation will be done through mobile. For the practical concerns, including the timeline, we are not able to make it into an IOS / Android application just yet. Still the system design considers mobile first expereince
* **Account Handling**: One of the first hurdles to Web3 services is account handling. Especially for those who are not familiar with Web3, which is likely to be our yatch event user base, wallet set up would be difficult. For this reason, we integrate **[Wepin for social login](https://docs.wepin.io/en)** instead.
* **Smooth Payment**: There will be user base who are more likely to make payment in fiat before the Web3 onboarding. For this reason, we integrate **[Stripe API](https://docs.stripe.com/crypto/pay-with-crypto)** for the fiat payment
* **Easy Event Participation**: Event registration and onsite checks need to be handled easily. For this, we are considering **[Luma like QR code](https://help.lu.ma/p/helpart-CBQRlYKtvQZciSd/check-in-guests-for-in-person-events)** for the ease of use

References above are the current considerations. As the system develops, the team may select solutions that are aligned with the same principle but provide a better experience

# Growth strategy
![Growth Strategy](https://github.com/user-attachments/assets/09fdbdee-7541-4bae-b963-833f6a87aca7)

* In the beginning, Yat Clubs operate events with yachts delegated to the club from the owners. We sign contracts with the Yacht owners which shares service fees generated from the event. Also, we promise a portion of payment in $YAT. In this way, service providers are incentivized with both operation rate and the $YAT price appreciation
* Users are enjoyers who purchase service based on the value they see. What they need more than anything is a good service experience. As long as the quality yacht events are listed at an affordable price, they are likely to purchase the service
* Payment received from the user for the service is stored on Yat Club Team Treasury. From this, they payment will be made to the service providers based on the fee share agreement. The rest of the profit can be utilized by the team. With the amount, Yat Club is dedicated to buyback some of the $YAT on the market to ramp up the price
* During the process, $YAT token price appreciates. Since service providers are aligned, the token appreciation gives them the incentive to better yachts. Also, additional services providers, who see the profit, are likely to join in. It means more selection with better quality for the users

# Roadmap
![Global Roadmap](https://github.com/user-attachments/assets/ec1963ad-4dd0-4a53-b707-9c2acdb1eff9)

|  | **Phase 1** | **Phase 2** | **Phase 3** |
| --- | ------- | ------- | ------- |
| **Business** | Two Yachts in Korea | Global Yachts<br>Add more services | Luxury Membership Launchpad |
| **Development** | Fiat on rampe reservation | Generalized Platform<br>$YAT Staking to Service Providers<br> | Club Membership Economy |
| **Expected Deadline** | 2025 Q2 | 2025 Q4 | 2026 Q2 |

# Team

* **[Janbogo Asset](https://x.com/yat_club/status/1893918790083031331)**
* **[Ludium](https://github.com/Ludium-Official/yat-club)**
* **[Juniahn](https://earn.superteam.fun/t/pink-involved-16/)**
* **[Rocket](https://earn.superteam.fun/t/hani/)**
* **[Jihyun Park](https://earn.superteam.fun/t/9w/)**

# References

* **[Website](https://yatclub.io/)**
* **[$YAT Memecoin](https://dexscreener.com/solana/hcrbivzjsihbjwk1hkbxxbjsdsabzh73lmxrum6ij9nn)**
* **[Twitter](https://x.com/yat_club)**
* **[Telegram](https://t.me/yatclub_public)**
* **[$yatSOL LST repo](https://github.com/Ludium-Official/yat-club-contract)**
