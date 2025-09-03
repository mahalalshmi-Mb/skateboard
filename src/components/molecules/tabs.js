import React, { useMemo, useState } from "react";
import { useRouteMatch, useHistory, Link } from "react-router-dom";
import useCustomNavigation from "../../hooks/useCustomNavigation";

function Tabs(props) {
  const history = useHistory();
  const { url } = useRouteMatch();
  const { pushHistory, returnRedirectUrl } = useCustomNavigation();

  const tabs = useMemo(() => props.data, []);
  const [selectedTab, setSelectedTab] = useState(0);

  const tabClick = (tabId, tabIndex) => {
    setSelectedTab(tabIndex);

    pushHistory(`${url}/${tabId}`);
  };

  let toPage =
    props.pageKey == "airlinePartnerMain"
      ? "routeDevelopment"
      : "airportShuttle";

  return (
    <>
      <div className="tabs aem-GridColumn--default--none aem-GridColumn aem-GridColumn--default--12 aem-GridColumn--offset--default--0">
        <div>
          <div className="component tabs__component">
            <div className="container-fluid tabs__component--fullWidth">
              <div className="row">
                <div className="col-12">
                  <div className="tabs">
                    <div className="tabs--rowShadow">
                      <ul className="tabs__menu" role="tablist">
                        {tabs.map((item, index) => (
                          <li
                            key={index}
                            className={
                              selectedTab === index
                                ? "tabs__item active"
                                : "tabs__item"
                            }
                            role="tab"
                            onClick={() => tabClick(item.routeId, index)}
                          >
                            <Link
                              to={returnRedirectUrl(toPage)}
                              className="tabs__link"
                            >
                              {item.displayName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tabs;
