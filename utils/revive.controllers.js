const pool = require("./revive_db_connection"); // Ensure you import the pool correctly

//agencyId  = 1
//accountId for advertisers  = 2

//we are doing this for publishers only
const createPublisherAccount = async (name) => {
  const query = `INSERT INTO rv_accounts (account_type,account_name) VALUES ('TRAFFICKER',?)`;
  const [response] = await pool.execute(query, [name]);
  return response;
};
const createAdvertiserAccount = async (name) => {
  const query = `INSERT INTO rv_accounts (account_type,account_name) VALUES ('ADVERTISER',?)`;
  const [response] = await pool.execute(query, [name]);
  return response;
};

//here we add advertiser to revive client table and store id to our database
const addReviveAdvertiser = async (name, email) => {
  try {
    const account = await createAdvertiserAccount(name);
    const query = `INSERT INTO rv_clients (clientname,email,updated,account_id,agencyId) VALUES (?,?,NOW(),?,1)`;
    const [response] = await pool.execute(query, [
      name,
      email,
      account.insertId,
    ]);
    return response;
  } catch (error) {
    console.log(error);
  }
};
//here we get affiliate id and store it on our database
const addRevivePublisherOrAffiliate = async (name, email, website) => {
  try {
    const account = await createPublisherAccount(name);
    const query = `INSERT INTO rv_affiliates (name,email,website,agencyid,updated,account_id) VALUES (?,?,?,1,NOW(),?)`;
    const [response] = await pool.execute(query, [
      name,
      email,
      website,
      account.insertId,
    ]);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
const deleteReviveBanner = async (bannerId) => {
  try {
    const query = `DELETE FROM rv_banners WHERE bannerId = ?`;
    const [response] = await pool.execute(query, [bannerId]);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
//here we create zone to revive and store id to our database
const addReviveZone = async (zonename, width, height, affiliateId) => {
  try {
    const query = `INSERT INTO rv_zones (affiliateId,zonename,width,height,zonetype,updated,category,ad_selection,chain,prepend,append,what) VALUES (?,?,?,?,3,NOW(),"","","","","","")`;
    const [response] = await pool.execute(query, [
      affiliateId,
      zonename,
      width,
      height,
    ]);
    return response;
  } catch (error) {
    console.log(error);
  }
};

//link banner and zone
//ad_id is equal to banner_id
const linkZoneAndBanner = async (zone_id, banner_id) => {
  try {
    const query = `INSERT INTO rv_ad_zone_assoc (zone_id,ad_id) VALUES (?,?)`;
    const [response] = await pool.execute(query, [zone_id, banner_id]);
    return response;
  } catch (error) {
    console.log(error);
  }
};
const unlinkReviveZoneAndBanner = async (zoneBannerId) => {
  try {
    const query = `DELETE FROM rv_ad_zone_assoc WHERE ad_zone_assoc_id = ?`;
    const [response] = await pool.execute(query, [zoneBannerId]);
    return response;
  } catch (error) {
    console.log(error);
  }
};

//create campaign
const addReviveCampaign = async (
  campaignname,
  type,
  weight,
  clientid,
  revenue,
  revenue_type,
  activate_time,
  expire_time,
  target_impression,
  target_click
) => {
  try {
    const query = `INSERT INTO rv_campaigns (capping,session_capping,show_capped_no_cookie,updated,campaignname,type,priority,weight,clientid,revenue,revenue_type,activate_time,expire_time,target_impression,target_click) VALUES (100000000,5,1,NOW(),?,?,?,?,?,?,?,?,?,?,?)`;
    const [response] = await pool.execute(query, [
      campaignname,
      type,
      type,
      weight,
      clientid,
      revenue,
      revenue_type,
      activate_time,
      expire_time || null,
      target_impression,
      target_click,
    ]);
    return response;
  } catch (error) {
    console.log(error);
  }
};
//add banner to a compaign
//filname should be the link
//url is destination url
//contenttype  is extension
//storagetype is web or html

const addReviveBanner = async (
  campaignid,
  storagetype,
  width,
  height,
  imageurl,
  htmltemplate,
  destinationURL
) => {
  try {
    console.log(imageurl);
    let extension;
    if (imageurl) {
      const splitResults = imageurl.split(".");
      extension = splitResults[splitResults.length - 1];
    } else {
      const splitResults = htmltemplate.split(".");
      extension = splitResults[splitResults.length - 1];
    }
    const query = `INSERT INTO rv_banners (campaignid,contenttype,storagetype,width,height,imageurl,htmltemplate,url,updated,htmlcache,bannertext,compiledlimitation,append,prepend) VALUES (?,?,?,?,?,?,?,?,NOW(),"","","","","")`;
    const [response] = await pool.execute(query, [
      campaignid,
      extension,
      storagetype,
      width,
      height,
      imageurl || "",
      htmltemplate || "",
      destinationURL,
    ]);
    return response;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addRevivePublisherOrAffiliate,
  addReviveAdvertiser,
  linkZoneAndBanner,
  unlinkReviveZoneAndBanner,
  addReviveZone,
  addReviveCampaign,
  deleteReviveBanner,
  addReviveBanner,
};
