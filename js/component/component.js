define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim"
], function (Marionette, Radio, Shim) {

    // Enviroment
    var App = new Marionette.Application();

    var ExampleLayout = Marionette.LayoutView.extend({
        el: "body",
        template: _.template("<div id=\"example\" style=\"width:100%;height:500px\"></div>"),
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
            title: "El titulo",
            controls: [
                {
                    align: "left",
                    name: "removeFilters"
                },
                {
                    align: "right",
                    name: "btnModified"
                },
                {
                    align: "right",
                    name: "btnNew"
                },
                {
                    align: "right",
                    name: "btnDeleted"
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

        Component.ComponentItemView = Marionette.LayoutView.extend({
            tagName: "div",
            className: "component",
            template: _.template('<div class="header"><h1><%- title %></h1></div><div class="controls"><div class="left"></div><div class="right"></div></div><div class="content"></div>'),
            regions: {
                title: ".title",
                controls: ".controls",
                content: ".content"
            },

            onRender: function(){
                console.log('Component.ComponentLayoutView: onRender');
                var componentChannel = this.model.get('channel');
                this.createRadioChannel(componentChannel);

            },

            onShow: function(){
                var title = this.model.get('title');
                var controls = this.model.get('controls');

                this.createControls(controls);
                this.setDimentions(title, controls);
            },

            createRadioChannel: function(componentChannel){
                // channel
                var ComponentChannel = Radio.channel(componentChannel);
            },

            createControls: function(controls){
                _.each(controls, function(control,i){
                    var align = control.align;
                    var name = control.name;
                    var icon = control.icon;

                    var ControlView = Backbone.Marionette.ItemView.extend({
                        tagName: "li",
                        id: name,
                        className: "btn",
                        template: _.template(''),
                    });

                    var ControlRegion = Backbone.Marionette.Region.extend({
                        el: "." + align,

                        attachHtml: function(view){
                            // Some effect to show the view:
                            this.$el.append(view.el);
                          },

                        initialize: function(options){
                        // your init code, here
                        },
                    });

                    Component.controlRegion = new ControlRegion();
                    Component.controlRegion.show(new ControlView(), { preventDestroy: true });

                });
            },

            setDimentions: function(title, controls){
                var header = this.$el.find(".header");
                var controlsPointer = this.$el.find(".controls");
                var content = this.$el.find(".content");

                var titleHeight = header.outerHeight();
                var controlsHeight = controlsPointer.outerHeight();
                var contentHeight = content.height();

                // get region parent dimentions
                var regionHeight = this.$el.parent().height();

                // set content height
                var baseContentHeight = regionHeight - titleHeight - controlsHeight;

                // put height to content
                this.$el.find(".content").height(baseContentHeight + "px");


                if(title == "" || title == null){
                    // eliminate header
                    header.hide();
                    // add title height to content height
                    this.$el.find(".content").height(baseContentHeight + titleHeight + "px");
                }

                if(controls.length == 0 || controls == null){
                    // eliminate header
                    controlsPointer.hide();
                    // add title height to content height
                    this.$el.find(".content").height(baseContentHeight + controlsHeight + "px");
                }
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
