// @flow
import cheerio from 'cheerio';

export const parseClubData = (body: string) => {
  const $ = cheerio.load(body);
  const club = {
    type: 'club',
    data: {
      club: {
        id: $('#verein_select_breadcrumb').val(),
        name: $('.dataName h1 b').text().trim(),
      },
      players: []
    }
  };

  $('table.items tbody > tr .posrela .hauptlink .hide-for-small .spielprofil_tooltip').each((i, el) => {
    const $link = $(el);
    club.data.players.push({
      id: $link.attr('id'),
      name: $link.text().trim()
    })
  });

  return club;
};

export const parseClubLinks = null;

// export const parseClubLinks = (body: string) => {
//   const $ = cheerio.load(body);
//   const links = [];
//   $('table.items tbody > tr .posrela .hauptlink .hide-for-small .spielprofil_tooltip').each((i, el) => {
//       const $link = $(el);
//       links.push({
//           url: `http://www.transfermarkt.com${$link.attr('href')}`,
//           pageType: 'player'
//       });
//   });
//
//   return links;
// }
