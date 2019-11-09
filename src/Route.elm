module Route exposing (Route(..), Slug(..), fromUrl, href, slugToString)

import Browser.Navigation as Nav
import Html exposing (Attribute)
import Html.Attributes as HAtt
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s, string)


type Route
    = Home
    | BlogPost Slug
    | BlogIndex


type Slug
    = Slug String


slugToString : Slug -> String
slugToString (Slug s) =
    s


urlParser : Parser (Slug -> a) a
urlParser =
    Parser.custom "SLUG" (\str -> Just (Slug str))


parser : Parser (Route -> a) a
parser =
    oneOf
        [ Parser.map Home Parser.top
        , Parser.map BlogPost (s "blog" </> urlParser)
        , Parser.map BlogIndex (s "blog")
        ]



-- PUBLIC HELPERS


href : Route -> Attribute msg
href targetRoute =
    HAtt.href (routeToString targetRoute)


replaceUrl : Nav.Key -> Route -> Cmd msg
replaceUrl key route =
    Nav.replaceUrl key (routeToString route)


fromUrl : Url -> Maybe Route
fromUrl url =
    Parser.parse parser <| url



-- INTERNAL


routeToString : Route -> String
routeToString page =
    let
        pieces =
            case page of
                Home ->
                    []

                BlogPost slug ->
                    [ "blog", slugToString slug ]

                BlogIndex ->
                    [ "blog" ]
    in
    "/" ++ String.join "/" pieces
