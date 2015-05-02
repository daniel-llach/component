define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim"
], function (Marionette, Radio, Shim) {

    // Enviroment
    var App = new Marionette.Application();

    var ExampleLayout = Marionette.LayoutView.extend({
        el: "body",
        template: _.template("<div id=\"example\" style=\"width:100%;\"></div>"),
        className: "component"
    });

    var Target = new ExampleLayout();
    Target.addRegion("main", "#example");
    Target.render();

    // Data
    var dataComponent = [
        {
            id: "component1",
            region: "main",
            channel: "c1",
            title: "El título",
            controls: [
                {
                    align: "right",
                    name: "sorting",
                    icon: "filter",
                }
            ],
            content: [
                {
                    name: "table"
                }
            ]
        }
    ];

    // Component Module !
    App.module("Component", function(Component, App, Backbone, Marionette, $, _, dataComponent){

        // modelo
        Component.ComponentModel = Backbone.Model.extend({
            defaults: {}
        });

        Component.ComponentCollection = Backbone.Collection.extend({
            model: Component.ComponentModel
        });

        Component.ComponentItemView = Marionette.ItemView.extend({
            tagName: "div",
            className: "component",
            template: _.template('<div class="header"><h1><%- title %></h1></div><div class="controls"></div><div class="content"></div>'),
            regions: {
                title: ".title",
                controls: ".controls",
                content: ".content"
            },
            onRender: function(){
                console.log('Component.ComponentLayoutView: onRender');

                var title = this.model.get('title');
                console.log("title: ", title);
            }
        });

        Component.addInitializer(function(){
            // create models with collections
            var components= new Component.ComponentCollection(dataComponent);

            components.each(function(component){
                var region = component.get("region");

                // create
                var contentView = new Component.ComponentItemView({model:component});
                console.log("contentView: ", contentView);

                Target[region].show(contentView);
            });

        });

    }, dataComponent);




    return App;
});
