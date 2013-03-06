### R code from vignette source 'flowPeaks-guide.Rnw'

###################################################
### code chunk number 1: stage0
###################################################
library(flowPeaks)


###################################################
### code chunk number 2: stage1
###################################################
data(barcode)
summary(barcode)
fp<-flowPeaks(barcode)


###################################################
### code chunk number 3: stage2b
###################################################
png("fig1.png",width=2000,height=2000,res=300)


###################################################
### code chunk number 4: stage2
###################################################
plot(fp,idx=c(1,3))


###################################################
### code chunk number 5: stage2e
###################################################
dev.off()


###################################################
### code chunk number 6: stage3b
###################################################
png("fig2.png",width=2000,height=2000,res=300)


###################################################
### code chunk number 7: stage3
###################################################
par(mfrow=c(2,2))
plot(fp,idx=c(1,2,3))


###################################################
### code chunk number 8: stage3e
###################################################
dev.off()


###################################################
### code chunk number 9: stage4b
###################################################
png("fig3.png",width=2000,height=2000,res=300)


###################################################
### code chunk number 10: stage4
###################################################
fp2<-flowPeaks(barcode[,c(1,3)])
plot(fp2)


###################################################
### code chunk number 11: stage4a
###################################################
evalCluster(barcode.cid,fp2$peaks.cluster,method="Vmeasure")


###################################################
### code chunk number 12: stage4e
###################################################
dev.off()


###################################################
### code chunk number 13: stage6b
###################################################
png("fig4.png",width=2000,height=2000,res=300)


###################################################
### code chunk number 14: stage6
###################################################
fpc<-assign.flowPeaks(fp2,fp2$x)
plot(fp2,classlab=fpc,drawboundary=FALSE,
  drawvor=FALSE,drawkmeans=FALSE,drawlab=TRUE)


###################################################
### code chunk number 15: stage6e
###################################################
dev.off()


###################################################
### code chunk number 16: stage7b
###################################################
png("fig5.png",width=2000,height=2000,res=300)  


###################################################
### code chunk number 17: stage7
###################################################
require(flowCore)
samp <- read.FCS(system.file("extdata","0877408774.B08",
package="flowCore"))
##do the clustering based on the asinh transforamtion of
##the first two FL channels
fp.z<-flowPeaks(asinh(samp@exprs[,3:4]))
plot(fp.z)


###################################################
### code chunk number 18: stage7e
###################################################
dev.off()


