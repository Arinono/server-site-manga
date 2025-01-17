const { gql } = require('apollo-server');

const typeDefs = gql`
    type Manga {
        id: Int
        title: String
        team: String
        cover_checksum: String
        cover_path: String
        chapters: [Chapter]
    }
    type Chapter {
        id: Int
        number: String
        title: String
        url: String
        date: Date
        manga_id: Int
        manga: Manga
    }
`;

module.exports.typeDefs = typeDefs;