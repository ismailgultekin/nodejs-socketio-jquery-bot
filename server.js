var socket  = require( 'socket.io' );
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = socket.listen( server );
var port    = process.env.PORT || 3000;

//Bot için kullandıklarımız
var request = require('request'); // İstek yapmak için kullanılacak paket.
var cheerio = require('cheerio'); // Getirilen veriyi parçalamak için kullanılacak paket.

server.listen(port, function () {
  console.log('Server bağlandı at port %d', port);
});

//Socket Tarafi
io.sockets.on('connection', function (socket) { 
    console.log('Socket bağlantı başladı.' + ' SocketId: '+ socket.id);
    
    socket.on('n11fiyatal', function(data){
        // N11 Bot
        var url = data.n11urunurl;
        request(url, function (error, response, html) {
            if ( ! error && response.statusCode == 200) {

                var $ = cheerio.load(html);
                    $snc  = $('.newPrice').html();
                    $sncv  = $('#productDisplayPrice').val();
                    //console.log('ok : ' + $sncv + " / " +$snc);
                socket.emit('n11fiyatver', { fiyat: $sncv });
                
            }
        });
    });

    socket.on('sahibindenilanal', function(data){
        
        //Sahibinden Bot
        var url = data.sahibindenurl;
        request(url, function (error, response, html) {
            if ( ! error && response.statusCode == 200) {

                var $ = cheerio.load(html);
                var liste = Array();
                $('tr.searchResultsItem').each(function(i, element){

                    console.log($(this).find('a.classifiedTitle').text());
                    var deger = $(this).find('a.classifiedTitle').text();
                    //liste.push(deger);
                    socket.emit('sahibindenlistever', { veri: deger });
                });
                //socket.emit('sahibindenlistever', { veri: liste });
            }
        });

    });

    //Kullanıcının çıkışını yakalayalım
    socket.on('disconnect', () => {
        console.log('Kullanıcı ayrıldı.');
    });

});



