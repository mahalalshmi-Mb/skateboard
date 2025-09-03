import styled from "styled-components";
import { getImage } from "./festiveThemingUtil";
import { device } from "../../commons/util/helperFunctions";

const Picture = styled.picture`
  display: ${({ hasMobile }) => (!hasMobile ? "none" : "block")};

  @media ${device.laptop} {
    display: ${({ hasDesktop }) => (!hasDesktop ? "none" : "block")};
  }
`;

const CustomPicture = (props) => {
  return (
    <Picture
      hasMobile={props.mobilePicture ? true : false}
      hasDesktop={props.desktopPicture ? true : false}
    >
      <source media="(min-width:1024px)" srcSet={props.desktopPicture} />
      <img alt="mobile-festive" src={props.mobilePicture} style={props.style} />
    </Picture>
  );
};

export const FestiveComponents = {
  christmas: {
    header: {
      hamburger: {
        imageOne: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/header/hamburger/mobile/imageOne.svg"
            )}
            style={{
              position: "absolute",
              bottom: "270px",
              right: 0,
              zIndex: 9,
            }}
          />
        ),
        twitter: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/header/hamburger/mobile/twitter.svg"
            )}
          />
        ),
        facebook: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/header/hamburger/mobile/facebook.svg"
            )}
          />
        ),
        linkedin: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/header/hamburger/mobile/linkedin.svg"
            )}
          />
        ),
        instagram: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/header/hamburger/mobile/instagram.svg"
            )}
          />
        ),
        youtube: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/header/hamburger/mobile/youtube.svg"
            )}
          />
        ),
        upArrow: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/header/hamburger/mobile/upArrow.svg"
            )}
          />
        ),
        downArrow: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/header/hamburger/mobile/downArrow.svg"
            )}
          />
        ),
      },
      nav: {
        cart: (
          <>
            <CustomPicture
              mobilePicture={getImage("christmas/header/nav/desktop/cart.svg")}
              style={{
                height: "20px",
                width: "20px",
              }}
            />
            <CustomPicture
              desktopPicture={getImage("christmas/header/nav/desktop/cart.svg")}
            />
          </>
        ),
        location: (
          <>
            <CustomPicture
              mobilePicture={getImage(
                "christmas/header/nav/mobile/location.svg"
              )}
            />
            <CustomPicture
              desktopPicture={getImage(
                "christmas/header/nav/desktop/location.svg"
              )}
            />
          </>
        ),
        search: (
          <CustomPicture
            mobilePicture={getImage("christmas/header/nav/mobile/search.svg")}
            style={{ height: "21px", width: "21px" }}
          />
        ),
        hamburger: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/header/nav/mobile/hamburger.svg"
            )}
            style={{ height: "20px", width: "20px" }}
          />
        ),
        profile: (
          <>
            <CustomPicture
              desktopPicture={getImage(
                "christmas/header/nav/desktop/profile.svg"
              )}
              style={{ height: "21px", width: "21px" }}
            />
            <CustomPicture
              mobilePicture={getImage(
                "christmas/header/nav/desktop/profile.svg"
              )}
              style={{ height: "20px", width: "20px" }}
            />
          </>
        ),
        bell: (
          <CustomPicture
            mobilePicture={getImage("christmas/header/nav/mobile/bell.svg")}
            style={{ height: "21px", width: "21px" }}
          />
        ),
      },
    },
    homepage: {
      qmsBanner: {
        imageOne: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/homepage/qmsBanner/mobile/imageOne.svg"
            )}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        ),
        imageTwo: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/homepage/qmsBanner/mobile/imageTwo.svg"
            )}
            style={{
              position: "absolute",
              bottom: "-30px",
              left: 0,
            }}
          />
        ),
      },
      howCanWeHelp: {
        imageOne: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/howCanWeHelp/desktop/imageOne.svg"
            )}
            style={{
              position: "absolute",
              top: 0,
              left: "54px",
            }}
          />
        ),
        bg: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/howCanWeHelp/desktop/bg.svg"
            )}
            style={{
              position: "absolute",
              top: "-50px",
              left: "50%",
              transform: "translate(-50%, 0)",
            }}
          />
        ),
      },
      gallery: {
        imageOne: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/gallery/desktop/imageOne.svg"
            )}
            style={{
              position: "absolute",
              top: "-96px",
              right: "80px",
            }}
          />
        ),
      },
      unwindOutdoors: {
        imageOne: (
          <>
            <CustomPicture
              desktopPicture={getImage(
                "christmas/homepage/unwindOutdoors/desktop/imageOne.svg"
              )}
              style={{
                position: "absolute",
                top: "-200px",
                right: "0px",
              }}
            />
            <CustomPicture
              mobilePicture={getImage(
                "christmas/homepage/unwindOutdoors/mobile/imageOne.svg"
              )}
              style={{
                position: "absolute",
                top: "-90px",
                right: "0px",
              }}
            />
          </>
        ),
        imageTwo: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/unwindOutdoors/desktop/imageTwo.svg"
            )}
            style={{
              position: "absolute",
              top: "-200px",
              left: "63px",
            }}
          />
        ),
        imageThree: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/unwindOutdoors/desktop/imageThree.svg"
            )}
            style={{
              position: "absolute",
              bottom: "220px",
              left: "0px",
            }}
          />
        ),
        imageFour: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/unwindOutdoors/desktop/imageFour.svg"
            )}
            style={{
              position: "absolute",
              bottom: "30px",
              right: "0px",
            }}
          />
        ),
        bg: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/unwindOutdoors/desktop/bg.svg"
            )}
            style={{
              position: "absolute",
              top: "-220px",
              left: "50%",
              transform: "translate(-50%, 0)",
            }}
          />
        ),
      },
      indoors: {
        imageOne: (
          <>
            <CustomPicture
              desktopPicture={getImage(
                "christmas/homepage/indoors/desktop/imageOne.svg"
              )}
              style={{
                position: "absolute",
                top: "20px",
                right: "10%",
              }}
            />
            <CustomPicture
              mobilePicture={getImage(
                "christmas/homepage/indoors/mobile/imageOne.svg"
              )}
              style={{
                position: "absolute",
                top: "0px",
                right: "12px",
              }}
            />
          </>
        ),
        imageTwo: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/indoors/desktop/imageTwo.svg"
            )}
            style={{
              position: "absolute",
              top: "100px",
              left: "30%",
            }}
          />
        ),
        imageThree: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/indoors/desktop/imageThree.svg"
            )}
            style={{
              position: "absolute",
              top: "-85px",
              left: "0px",
            }}
          />
        ),
        imageFour: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/indoors/desktop/imageFour.svg"
            )}
            style={{
              position: "absolute",
              left: 0,
              bottom: "25px",
            }}
          />
        ),
        bg: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/indoors/desktop/bg.svg"
            )}
            style={{
              position: "absolute",
              bottom: "0px",
              right: "50px",
            }}
          />
        ),
      },
      weAllLoveBlr: {
        imageOne: (
          <>
            <CustomPicture
              desktopPicture={getImage(
                "christmas/homepage/weAllLoveBlr/desktop/imageOne.svg"
              )}
              style={{
                position: "absolute",
                top: "-100px",
                right: "0px",
              }}
            />
            <CustomPicture
              mobilePicture={getImage(
                "christmas/homepage/weAllLoveBlr/mobile/imageOne.svg"
              )}
              style={{
                position: "absolute",
                top: "-100px",
                right: "0px",
              }}
            />
          </>
        ),
        imageTwo: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/weAllLoveBlr/desktop/imageTwo.svg"
            )}
            style={{
              position: "absolute",
              bottom: "-45px",
              right: "25%",
            }}
          />
        ),
        imageThree: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/weAllLoveBlr/desktop/imageThree.svg"
            )}
            style={{
              position: "absolute",
              bottom: "20px",
              left: "55px",
            }}
          />
        ),
        bg: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/weAllLoveBlr/desktop/bg.svg"
            )}
            style={{
              position: "absolute",
              top: "0px",
              left: "5%",
            }}
          />
        ),
      },
      airportMaps: {
        imageOne: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/airportMaps/desktop/imageOne.svg"
            )}
            style={{
              position: "absolute",
              top: "-40px",
              right: "0px",
            }}
          />
        ),
        imageTwo: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/homepage/airportMaps/mobile/imageTwo.svg"
            )}
            style={{
              position: "absolute",
              top: "-30px",
              right: "0px",
            }}
          />
        ),
        bg: (
          <CustomPicture
            desktopPicture={getImage(
              "christmas/homepage/airportMaps/desktop/bg.svg"
            )}
            style={{
              position: "absolute",
              bottom: "0px",
              right: "5%",
            }}
          />
        ),
      },
    },
    bottomNav: {
      bottomNav: {
        transportFill: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/transportFill.svg"
            )}
          />
        ),
        homeFill: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/homeFill.svg"
            )}
          />
        ),
        flightsFill: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/flightsFill.svg"
            )}
          />
        ),
        rewardsFill: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/rewardsFill.svg"
            )}
          />
        ),
        servicesFill: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/servicesFill.svg"
            )}
          />
        ),
        profileFill: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/profileFill.svg"
            )}
          />
        ),
        transportOutline: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/transportOutline.svg"
            )}
          />
        ),
        homeOutline: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/homeOutline.svg"
            )}
          />
        ),
        flightsOutline: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/flightsOutline.svg"
            )}
          />
        ),
        rewardsOutline: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/rewardsOutline.svg"
            )}
          />
        ),
        servicesOutline: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/servicesOutline.svg"
            )}
          />
        ),
        profileOutline: (
          <CustomPicture
            mobilePicture={getImage(
              "christmas/bottomNav/bottomNav/mobile/profileOutline.svg"
            )}
          />
        ),
      },
    },
  },
};
