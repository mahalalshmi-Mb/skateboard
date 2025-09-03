import {
  ArtistImage,
  ArtistImagesLayout,
  ImageBlock,
  ArtistName,
  ArtistInfo,
  Header,
  Title,
  MobileViewAllBtn,
  ViewAllBtn,
  BtnText,
  ArtistCount,
  Break,
} from "./style";
import Text from "../../atoms/Text";
import { Link } from "react-router-dom";
import useCustomNavigation from "../../../hooks/useCustomNavigation";

function ImageCardListing(props) {
  const { returnRedirectUrl } = useCustomNavigation();

  const splittingText = (text) => {
    if (text) {
      if (text.trim().length > 16) {
        return text.trim().slice(0, 16) + "..";
      } else {
        return text.trim();
      }
    }
  };

  return props?.data?.length > 0 ? (
    <>
      {props?.isHeader ? (
        <Header>
          <Title>
            <Text type="bold">{props?.headerTitle}</Text>
          </Title>

          <Link
            to={returnRedirectUrl(props?.viewBtnUrl)}
            style={{ marginLeft: "auto" }}
          >
            {props?.isMobile ? (
              <MobileViewAllBtn>
                <Text type="bold">View All</Text>
              </MobileViewAllBtn>
            ) : (
              <ViewAllBtn>
                <BtnText>
                  <Text type="bold">View All</Text>
                </BtnText>
              </ViewAllBtn>
            )}
          </Link>
          <Break />
          <ArtistCount>
            <Text>
              {props?.totalDataCount} {props?.type}
            </Text>
          </ArtistCount>
        </Header>
      ) : null}

      <ArtistImagesLayout
        wrap={props?.wrap}
        style={props?.style}
        scroll={props?.scroll}
        isPadded={props?.isPadded}
      >
        {props?.data &&
          props.data.map((item, index) => (
            <Link
              key={item?.id}
              to={returnRedirectUrl(
                item?.redirectLink !== null ? item?.redirectLink : "#"
              )}
            >
              <ImageBlock
                cursor={item?.redirectLink !== null ? "pointer" : "default"}
                onClick={() => props?.render && props.setRender(!props.render)}
              >
                <ArtistImage
                  src={item?.images?.[0]?.url}
                  bcolor={props?.bcolor}
                  effect="blur"
                  wrap={props?.wrap}
                  itemindex={index}
                />
                <ArtistName>
                  <Text type="bold">{splittingText(item?.header)}</Text>
                </ArtistName>
                <ArtistInfo>
                  <Text>{splittingText(item?.link)}</Text>
                </ArtistInfo>
              </ImageBlock>
            </Link>
          ))}
      </ArtistImagesLayout>
    </>
  ) : (
    <div
      className="no__results"
      style={{
        display: "block",
        padding: "20px",
        margin: "20px 30px 0 0",
      }}
    >
      <div className="error__heading">
        <div className="error__image"></div>
        <p className="error__title">Stay tuned for more arts unfolding soon</p>
      </div>
      <div className="error__body">
        <p className="error__subtitle"></p>
        <p className="error__description"></p>
      </div>
    </div>
  );
}

export default ImageCardListing;
