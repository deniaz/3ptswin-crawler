// @flow
import cheerio from 'cheerio';

export const parseCompetitionData = (body: string): Object => {
    const $ = cheerio.load(body);
    const competition = {
        type: 'competition',
        data: {
            competition: {
                id: $('#wettbewerb_select_breadcrumb').val(),
                name: $('.spielername-profil').text().trim(),
                season: $('[name="saison_id"]').val()
            },
            clubs: []
      }
    };

    $('#main > .row > .large-8.columns > .box .responsive-table table tbody tr').each((i, el) => {
      const $tr = $(el);
      const $anchor = $tr.find('.hauptlink.hide-for-small a.vereinprofil_tooltip');

      competition.data.clubs.push({
          id: $anchor.attr('id'),
          name: $anchor.text(),
      });
    });

    return competition;
};

export const parseCompetitionLinks = (body: string): string[] => {
    const $ = cheerio.load(body);
    const links = [];
    $('.hauptlink.hide-for-small .vereinprofil_tooltip').each((i, el) => {
        const $link = $(el);
        links.push({
            url: `http://www.transfermarkt.com${$link.attr('href')}`,
            pageType: 'club'
        });
    });

    return links;
};
