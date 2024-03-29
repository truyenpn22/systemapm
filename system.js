class SystemApm {
    constructor(config) {
        this.width = 1520;
        this.height = 380;
        this.timerID;
        this.data = config.data;
        this.timeWarning = config.timeWarning || 8000;
        this.timeDanger = config.timeDanger || 12000;
        this.svg = d3.select("#system").attr("width", this.width).attr("height", this.height).append("g");
        this.pannelGroup = this.svg.append('g').attr("class", "pannelGroup")
        this.spaceshipGroup = this.svg.insert('g', ':first-child').attr("class", "spaceshipGroup")

        this.tablegroup = this.pannelGroup.append("g").attr("class", "table-content").attr("transform", (d, i) => "translate(-2, 10)")

        this.progressBox = this.pannelGroup.append("g").attr("class", "progress-box")
        this.planGroup = this.spaceshipGroup.append('g').attr("class", "planGroup").attr("transform", (d, i) => "translate(0, 30)")
        this.blackhole = this.spaceshipGroup.append('g').attr("class", "blackhole").attr("transform", (d, i) => "translate(0, 30)")

        this.initializeData();
        this.createEqualizer();
        this.renderRequests(this.data)
        this.createLinearGradient("gradient-normal", "#526dce", "#3652AD");
        this.createLinearGradient("gradient-warning", "#FFBB00", "#ff8b24");
        this.createLinearGradient("gradient-danger", "#CC3D3D", "#B31312");


    }

    initializeData() {

        this.pannelGroup.insert("g", ':first-child')
            .attr("transform", (d, i) => "translate(" + (i * (this.width) + ((this.width)) / 4) + ", 30)")
            .each(function (d, i) {
                d3.select(this).append("image").attr("class", "server-image").attr("xlink:href", "./img/WEB.png");

                d3.select(this).append("circle").attr("class", "server-circle").attr("cx", 35).attr("cy", 35).attr("r", 6)
                    .attr("stroke", "#1F2544").attr("stroke-width", 0.5).attr("filter", "brightness(1.2)").attr("fill", "#53BDCF").attr("cursor", "pointer");

                d3.select(this).append("circle").attr("class", "server-circle").attr("cx", 35).attr("cy", 55).attr("r", 6)
                    .attr("stroke", "#1F2544").attr("stroke-width", 0.5).attr("filter", "brightness(1.2)").attr("fill", "#42A793").attr("cursor", "pointer");

                d3.select(this).append("text").attr("class", "server-text").attr("x", 35).attr("y", 160).attr("text-anchor", "middle").attr("fill", "#EAEAEA")
                    .attr("font-size", "16px").attr("font-weight", 700).style("text-shadow", "0px 0px 3px #ffffff").style("filter", "brightness(2)").text("WEB");
            });
    }

    createEqualizer() {
        const _w = 29;
        const colorScale = d3.scaleLinear().domain([0, 50, 100]).range(["#13e913", "#ffff00", "#ff0000"]);

        let equalizerGroup1 = this.progressBox.select('.equalizerGroup1');
        let equalizerGroup2 = this.progressBox.select('.equalizerGroup2');

        if (equalizerGroup1.empty()) {
            equalizerGroup1 = this.progressBox.append("g").attr("class", "equalizerGroup1").attr("transform", "translate(500, 50)");
        }

        if (equalizerGroup2.empty()) {
            equalizerGroup2 = this.progressBox.append("g").attr("class", "equalizerGroup2").attr("transform", "translate(500, 315)");
        }

        for (let index = 0; index < 100 / 3; index++) {
            const gradient = Math.round(((index + 1) * 100) / 100) * 3;
            const gradientColor = colorScale(gradient);
            const x = index * (_w + 1);

            let bar1 = equalizerGroup1.select(".bar:nth-child(" + (index + 1) + ")");
            if (bar1.empty()) {
                bar1 = equalizerGroup1.append("rect").attr("class", "bar");
            }
            bar1.attr("x", x).attr("y", 0).attr("width", _w).attr("height", 5).attr("fill", gradientColor).attr("rx", 2).attr("ry", 2)
                .attr("opacity", index > 16 ? index * 0 : 0.7).transition().duration(1000).attr("opacity", index > 12 ? index * 0 : 0.7)
                .transition().duration(1000).attr("opacity", 1);

            let bar2 = equalizerGroup2.select(".bar:nth-child(" + (index + 1) + ")");
            if (bar2.empty()) {
                bar2 = equalizerGroup2.append("rect").attr("class", "bar");
            }
            bar2.attr("x", x).attr("y", 0).attr("width", _w).attr("height", 5).attr("fill", gradientColor).attr("rx", 2).attr("ry", 2)
                .attr("opacity", index > 10 ? index * 0 : 0.7).transition().duration(1000).attr("opacity", index > 14 ? index * 0 : 0.7)
                .transition().duration(1000).attr("opacity", 1);
        }

        if (this.timerID) {
            clearInterval(this.timerID)
        }
        this.timerID = setInterval(() => {
            this.createEqualizer();
        }, 2000);
    }


    performAction(action) {
        switch (action) {
            case "register":
                return 'WEB';
            case "WEB":
                return 'unregister';
            case "unregister":
                return null;
            default:
                return null;
        }
    }

    transitionSpaceship(attributes, transitionParams, opacity = 1) {
        attributes.style("opacity", 0).transition().duration(500).delay(transitionParams).ease(d3.easeLinear).style("opacity", opacity)
    }

    createLinearGradient(id, startColor, endColor) {
        const gradient = this.tablegroup.append("defs")
            .append("linearGradient")
            .attr("id", id)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", startColor);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", endColor);
    }


    renderRequests(data) {
        data.forEach((dataService, index) => {
            dataService.listService.forEach((service, serviceIndex) => {
                console.log(service);
                let _pl = this.planGroup.append('g')
                    .attr("transform", function () {
                        let row = Math.min(Math.floor(index / 3), 5);
                        let col = index % 5;
                        return "translate(" + col + "," + row * 40 + ")";
                    })

                _pl.append("g")
                    .attr("id", "" + service.name + "_" + service.id)
                    .attr("transform", "translate(0, 50)")
                    .each(function () {
                        d3.select(this).append("image").attr("id", "spaceship");
                        d3.select(this).append("image").attr("id", "spaceship-firer").attr("width", "40px").attr("height", "40px");
                        d3.select(this).append("text").attr("id", "spaceship-text").attr("fill", "#EAEAEA").attr("font-size", "12px").attr("text-anchor", "middle").text(service.name);
                    });
                this.moveRequest(service, index, 0, dataService, serviceIndex);
            });
        });
    }

    moveRequest(request, index, actionIndex, dataService, serviceIndex) {


        let requestImage = this.svg.select("#" + request.name + "_" + request.id);
        let action = request.actions[actionIndex];
        let nextServer = this.performAction(action);
        let nextIndex = request.actions[1].indexOf(nextServer);
        let planRect = nextIndex * (this.width) / 3.8;

        let groupElement = this.tablegroup.select('#rectTable-' + index);
        if (groupElement.empty()) {
            groupElement = this.tablegroup.append("g")
                .attr("id", "rectTable-" + index)
                .attr("transform", function () {
                    let row = Math.floor(index / 5);
                    let col = index % 5;
                    let translateX = col * 188;
                    let translateY = row * 60;
                    return "translate(" + translateX + "," + translateY + ")";
                })
        }


        let tableElement = this.tablegroup.select('#rectTableAm-' + index);
        if (tableElement.empty()) {
            tableElement = this.tablegroup.append('g')
                .attr("id", "rectTableAm-" + index)
                .attr("transform", function () {
                    let row = Math.floor(index / 5);
                    let col = index % 5;
                    let translateX = col * 188;
                    let translateY = row * 60;
                    return "translate(" + translateX + "," + translateY + ")";
                });
        }
        let createBlackhole = this.blackhole.select("#blackhole-" + index)

        if (createBlackhole.empty()) {
            createBlackhole = this.blackhole.append('g')
                .attr("id", "blackhole-" + index)
                .attr("transform", function () {
                    let row = Math.min(Math.floor(index / 3), 5);
                    let translateY = row * 40;
                    return "translate(" + 10 + "," + translateY + ")";
                });
        }


        let time;
        if (nextServer === "WEB") {
            time = request.timeIn;
            if (request.timeIn >= this.timeDanger) {
                request.status = "danger";
            } else if (request.timeIn >= this.timeWarning) {
                request.status = "warning";
            } else {
                request.status = "normal";
            }
        } else if (nextServer === "unregister") {
            time = request.timeOut;
            if (request.timeOut >= this.timeDanger) {
                request.status = "danger";
            } else if (request.timeOut >= this.timeWarning) {
                request.status = "warning";
            } else {
                request.status = "normal";
            }
        }






        requestImage
            .transition()
            .duration(1500)
            .delay(time)
            .ease(d3.easeLinear)
            .attr("transform", "translate(" + (planRect + 390) + ", 50)")
            .on("end", () => {
                let rectgroupElement = groupElement.select("rect").empty() ? groupElement.insert("rect", ':first-child') : groupElement.select("rect");
                let pathgroupElement = groupElement.select("path").empty() ? groupElement.append("path") : groupElement.select("path");
                let textgroupElement = groupElement.select("text").empty() ? groupElement.append("text") : groupElement.select("text");
                let circlegroupElement = groupElement.select("g").empty() ? groupElement.append("g") : groupElement.select("g");
                let itemlightGroup = groupElement.select("#itemlightGroup").empty() ? groupElement.append("g") : groupElement.select("#itemlightGroup");
                let rectTableElement = tableElement.select("rect").empty() ? tableElement.append("rect") : tableElement.select("rect");
                let texttableElement = tableElement.select("text").empty() ? tableElement.append("text") : tableElement.select("text");
                let tablelightGroup = tableElement.select("g").empty() ? tableElement.append("g") : tableElement.select("g");


                rectgroupElement.attr("x", 470).attr("y", 64).attr("width", 148).attr("height", 45).style("stroke", "white")
                    .style("filter", "drop-shadow(2px 2px 8px rgb(33, 33, 34))").style("stroke-width", 4).style("rx", 5).style("ry", 5)
                    .transition().duration(500).style("opacity", 1).style("stroke-width", 1)
                    .style("fill", () => {
                        switch (request.status) {
                            case "normal":
                                return "url(#gradient-normal)";
                            case "warning":
                                return "url(#gradient-warning)";
                            case "danger":
                                return "url(#gradient-danger)";
                            default:
                                return "url(#gradient-normal)";
                        }
                    })


                pathgroupElement.attr("d", `M ${500},58 h100 v6 h-115 q0,4 4,4 h107 q4,0 4,-4 v-6 Z`)
                    .attr("fill", "#EAEAEA").attr("filter", "blur(1.5px)").transition().duration(500).style("opacity", 1).attr("filter", "blur(0.1px)").attr("fill", "#41c2b1")

                textgroupElement.attr("x", 480).attr("y", 92).attr("text-anchor", "start").attr("fill", "#EAEAEA")
                    .attr("font-size", "14px").attr("font-weight", 500).style("text-shadow", "3px 3px 5px black").style("opacity", 1).text(request.name)

                rectTableElement.attr("x", 561).attr("y", 75).attr("width", 38).attr("height", 25)
                    .style("fill", "transparent").style("stroke", "#EAEAEA").style("stroke-width", 2).style("rx", 5).style("ry", 5)
                    .transition().duration(500).style("opacity", 1).style("stroke-width", 1).style("fill", "#0C2D57");

                texttableElement.attr("x", 580).attr("y", 93).attr("text-anchor", "middle").attr("fill", "#EAEAEA").attr("font-weight", 500).style("opacity", 1);

                let coordinates = [{ cx: 475, cy: 70 }, { cx: 475 + 135, cy: 70 }, { cx: 475, cy: 70 + 33 }, { cx: 475 + 135, cy: 70 + 33 }];
                coordinates.forEach(function (coord, i) {
                    const circle = circlegroupElement.select("#circle" + i);
                    if (circle.empty()) {
                        circlegroupElement.append("circle").attr("id", "circle" + i).attr("cx", coord.cx).attr("cy", coord.cy).attr("r", 0.6).attr("fill", "#EAEAEA");
                    }
                });

                let itemlight = [{ cx: 500, cy: 65 }, { cx: 595, cy: 110 }];
                itemlight.forEach((d) => {
                    itemlightGroup.append("ellipse").attr("cx", d.cx).attr("cy", d.cy).attr("rx", 5).attr("ry", 3).attr("fill", "#EAEAEA").style("filter", "blur(0.8px)")
                        .style("opacity", 1).transition().duration(400).ease(d3.easeLinear).style("opacity", 0).remove()

                    itemlightGroup.append("path").attr("d", `M ${d.cx - 0.8} ${d.cy} L ${d.cx - 8} ${d.cy - 8} L ${d.cx + 1.5} ${d.cy - 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("filter", "blur(0.8px)").style("opacity", 1).transition().duration(400).ease(d3.easeLinear).style("opacity", 0).remove()

                    itemlightGroup.append("path").attr("d", `M ${d.cx - 0.8} ${d.cy} L ${d.cx - 8} ${d.cy + 8}  L ${d.cx + 1.5} ${d.cy + 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("filter", "blur(0.8px)").style("opacity", 1).transition().duration(400).ease(d3.easeLinear).style("opacity", 0).remove()

                    itemlightGroup.append("path").attr("d", `M ${d.cx + 1} ${d.cy} L ${d.cx + 8} ${d.cy - 8} L ${d.cx - 1.5} ${d.cy - 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("filter", "blur(0.8px)").style("opacity", 1).transition().duration(400).ease(d3.easeLinear).style("opacity", 0).remove()

                    itemlightGroup.append("path").attr("d", `M ${d.cx - 0.2} ${d.cy + 1} L ${d.cx + 8} ${d.cy + 8} L ${d.cx + 1.5} ${d.cy - 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("filter", "blur(0.8px)").style("opacity", 1).transition().duration(400).ease(d3.easeLinear).style("opacity", 0).remove()
                });

                let light = [{ cx: 562, cy: 77 }, { cx: 596, cy: 77 + 22 }];
                light.forEach((corner) => {
                    tablelightGroup.append("ellipse").attr("cx", corner.cx).attr("cy", corner.cy).attr("rx", 4).attr("ry", 1)
                        .attr("fill", "#EAEAEA").style("filter", "blur(0.8px)").style("opacity", 1).transition().duration(500).ease(d3.easeLinear).style("opacity", 0).remove()

                    tablelightGroup.append("path").attr("d", `M ${corner.cx - 0.8} ${corner.cy} L ${corner.cx - 7} ${corner.cy - 7} L ${corner.cx + 1.5} ${corner.cy - 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("filter", "blur(0.8px)").style("opacity", 1).transition().duration(500).ease(d3.easeLinear).style("opacity", 0).remove()

                    tablelightGroup.append("path").attr("d", `M ${corner.cx - 0.8} ${corner.cy} L ${corner.cx - 7} ${corner.cy + 7}  L ${corner.cx + 1.5} ${corner.cy + 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("filter", "blur(0.8px)").style("opacity", 1).transition().duration(500).ease(d3.easeLinear).style("opacity", 0).remove()

                    tablelightGroup.append("path").attr("d", `M ${corner.cx + 1} ${corner.cy} L ${corner.cx + 7} ${corner.cy - 7} L ${corner.cx - 1.5} ${corner.cy - 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("filter", "blur(0.8px)").style("opacity", 1).transition().duration(500).ease(d3.easeLinear).style("opacity", 0).remove()

                    tablelightGroup.append("path").attr("d", `M ${corner.cx - 0.2} ${corner.cy + 1} L ${corner.cx + 7} ${corner.cy + 7} L ${corner.cx + 1.5} ${corner.cy - 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("filter", "blur(0.8px)").style("opacity", 1).transition().duration(500).ease(d3.easeLinear).style("opacity", 0).remove()
                });


                if (nextServer === "WEB") {
                    let currentValue = parseInt(texttableElement.text(), 10) || 0;
                    let value = currentValue + 1
                    texttableElement.text(value).style('opacity', value === 1 ? 0 : 1);
                    tableElement.style('opacity', value === 1 ? 0 : 1);
                } else if (nextServer === "unregister") {
                    let currentValue = parseInt(texttableElement.text(), 10) || 0;
                    let value = currentValue - 1
                    texttableElement.text(value).style('opacity', value === 1 ? 0 : 1);
                    tableElement.style('opacity', value === 1 ? 0 : 1);
                    if (currentValue === 1) {
                        rectgroupElement.style("stroke", "white")
                            .style("filter", "blur(0.6px)")
                            .style("rx", 5)
                            .style("ry", 5)
                            .transition()
                            .duration(500)
                            .style("fill", "transparent")
                            .style("stroke-width", 2)
                            .tween("opacity", function () {
                                const initialOpacity = parseFloat(d3.select(this).style("opacity"));
                                return function (t) {
                                    d3.select(this).style("opacity", initialOpacity * (1 - t));
                                };
                            })
                            .on("end", () => {
                                rectgroupElement.style("opacity", 0).remove()
                                pathgroupElement.style("opacity", 0).remove()
                                textgroupElement.style("opacity", 0).remove()
                                rectTableElement.style("opacity", 0).remove()
                                texttableElement.style("opacity", 0).remove()
                                circlegroupElement.style("opacity", 0).remove()
                                itemlightGroup.style("opacity", 0).remove()
                                tablelightGroup.style("opacity", 0).remove()
                            })
                        pathgroupElement.style("opacity", 0).remove()
                        rectTableElement.style("opacity", 0).remove()
                        texttableElement.style("opacity", 0).remove()
                        textgroupElement.style("opacity", 0).remove()
                        circlegroupElement.style("opacity", 0).remove()
                        tablelightGroup.style("opacity", 0).remove()
                        itemlightGroup.style("opacity", 1)
                    }
                }

                if (actionIndex < request.actions.length - 1) {
                    this.moveRequest(request, index, actionIndex + 1, dataService, serviceIndex);
                }

            });






        if (nextServer === "unregister") {
            let createBlackhole22 = createBlackhole.select("#ellipsegl_" + request.id).empty() ? createBlackhole.append("ellipse").attr('id', 'ellipsegl_' + request.id) : createBlackhole.select("#ellipsegl_" + request.id);

            d3.select("#ellipsebr_" + request.id).remove();

            requestImage.select("#spaceship").attr("xlink:href", "./img/img_spaceship_gl.png");
            this.transitionSpaceship(requestImage.select("#spaceship"), time);

            requestImage.select("#spaceship-text").attr("x", 60).attr("fill", "#EAEAEA").attr("font-size", "12px").attr("text-anchor", "middle").text(request.name);
            this.transitionSpaceship(requestImage.select("#spaceship-text"), time);

            requestImage.select("#spaceship-firer").attr("xlink:href", "./img/fire.webp").attr("x", -10).attr("y", -70).style("transform", "rotate(90deg)").style("filter", "hue-rotate(170deg)");
            this.transitionSpaceship(requestImage.select("#spaceship-firer"), time);


            createBlackhole22.attr("cx", 365).attr("cy", 58).attr("rx", 5).attr("ry", 10).attr("filter", "drop-shadow(0px 0px 3px #96EFFF)")
                .attr("opacity", 0).transition().delay(time).ease(d3.easeLinear).attr("opacity", 1);

        } else if (nextServer === "WEB") {
            let createBlackhole22 = createBlackhole.select("#ellipsebr_" + request.id).empty() ? createBlackhole.append("ellipse").attr('id', 'ellipsebr_' + request.id) : createBlackhole.select("#ellipsebr_" + request.id);

            requestImage.select("#spaceship").attr("xlink:href", "./img/img_spaceship_br.png");
            this.transitionSpaceship(requestImage.select("#spaceship"), time);

            requestImage.select("#spaceship-text").attr("x", -30).attr("fill", "#EAEAEA").attr("font-size", "12px").attr("text-anchor", "middle").text(request.name);
            this.transitionSpaceship(requestImage.select("#spaceship-text"), time);

            requestImage.select("#spaceship-firer").attr("xlink:href", "./img/fire.webp").attr("x", -30).attr("y", -42).style("transform", "rotate(-90deg)").style("filter", "hue-rotate(200deg)");
            this.transitionSpaceship(requestImage.select("#spaceship-firer"), time);

            createBlackhole22.attr("cx", 10).attr("cy", 58).attr("rx", 5).attr("ry", 10).attr("filter", "drop-shadow(0px 0px 3px #96EFFF)")
                .attr("opacity", 0).transition().delay(time).ease(d3.easeLinear).attr("opacity", 1);

        }
        else if (nextServer === null) {
            d3.selectAll("#" + request.name + "_" + request.id).remove();
            d3.selectAll("#" + request.name + "_" + serviceIndex).remove()
            d3.select("#ellipsegl_" + request.id).remove();
        }

    }

}

