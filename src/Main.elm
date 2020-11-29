module Main exposing (main)

import Blog
import BlogIndex
import Browser
import Browser.Navigation as Nav
import Home
import Html exposing (Html)
import Http
import Platform.Sub as Sub
import PlayGround
import Request exposing (getBlogPost)
import Route as R exposing (Route(..))
import Url exposing (Url)


main =
    Browser.application
        { init = init
        , onUrlChange = ChangedUrl
        , onUrlRequest = ClickedLink
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type Model
    = Home Nav.Key
    | BlogModel Blog.Model
    | BlogIndex BlogIndex.Model
    | PlayGround PlayGround.Model


toNavKey : Model -> Nav.Key
toNavKey model =
    case model of
        Home nk ->
            nk

        BlogModel m ->
            Blog.toNavKey m

        BlogIndex m ->
            BlogIndex.toNavKey m

        PlayGround m ->
            PlayGround.toNavKey m


type Msg
    = ClickedLink Browser.UrlRequest
    | ChangedUrl Url
    | GotPost R.Slug (Result Http.Error String)
    | GotPlayGroundMsg PlayGround.Msg


type alias Flags =
    { blogPost : String
    , title : String
    , date : Int
    }


init : Maybe Flags -> Url -> Nav.Key -> ( Model, Cmd Msg )
init maybeFlags url navKey =
    case maybeFlags of
        Just flags ->
            ( BlogModel
                { navKey = navKey
                , blogPost =
                    Blog.build
                        flags.blogPost
                        flags.title
                        flags.date
                }
            , Cmd.none
            )

        Nothing ->
            changeRouteTo (R.fromUrl url) (Home navKey)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( ClickedLink urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    ( model
                    , Nav.pushUrl (toNavKey model) (Url.toString url)
                    )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        ( ChangedUrl url, _ ) ->
            changeRouteTo (R.fromUrl url) model

        ( GotPost slug response, BlogModel m ) ->
            case response of
                Ok blogBody ->
                    ( BlogModel
                        { m
                            | blogPost =
                                Blog.buildFromSlug blogBody
                                    slug
                        }
                    , Cmd.none
                    )

                Err e ->
                    ( BlogModel { m | blogPost = Blog.NotFound }, Cmd.none )

        ( GotPlayGroundMsg subMsg, PlayGround pgModel ) ->
            PlayGround.update subMsg pgModel
                |> updateWith PlayGround
                    GotPlayGroundMsg

        ( _, _ ) ->
            ( model, Cmd.none )


updateWith : (subModel -> Model) -> (subMsg -> Msg) -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg )
updateWith toModel toMsg ( subModel, subCmd ) =
    ( toModel subModel
    , Cmd.map toMsg subCmd
    )


changeRouteTo : Maybe Route -> Model -> ( Model, Cmd Msg )
changeRouteTo maybeRoute model =
    case maybeRoute of
        Nothing ->
            ( model, Cmd.none )

        Just R.Home ->
            ( Home (toNavKey model)
            , Cmd.none
            )

        Just (R.BlogPost slug) ->
            ( BlogModel { navKey = toNavKey model, blogPost = Blog.init }
            , getBlogPost slug (GotPost slug)
            )

        Just (R.BlogIndex mtag) ->
            ( BlogIndex <| BlogIndex.Model (toNavKey model) mtag, Cmd.none )

        Just R.PlayGround ->
            ( PlayGround <| PlayGround.init (toNavKey model), Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Browser.Document Msg
view model =
    let
        ( title, htmlBody ) =
            body model
    in
    Browser.Document title <| [ htmlBody ]


body : Model -> ( String, Html Msg )
body model =
    let
        viewpage wrapMsg v =
            Tuple.mapSecond (Html.map wrapMsg) v
    in
    case model of
        Home _ ->
            Home.view

        BlogModel blogModel ->
            Blog.view blogModel

        BlogIndex blogIndexModel ->
            BlogIndex.view blogIndexModel

        PlayGround m ->
            viewpage GotPlayGroundMsg <| PlayGround.view m
